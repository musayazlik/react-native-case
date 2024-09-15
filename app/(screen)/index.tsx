import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { db } from "@firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  DocumentData,
} from "@firebase/firestore";
import { Post } from "@/types/post";
import CardItem from "@/components/CardItem";
import { useSegments } from "expo-router";
import { postsIndexStyles as styles } from "@/styles/Post";
import CagegoryFilter from "@/components/Dropdowns/CagegoryFilter";
import SortedFilter from "@/components/Dropdowns/SortedFilter";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const POSTS_LIMIT = 5;
  const segments = useSegments();
  const fetchData = async (
    isInitialLoad = false,
    selectedCategory?: string
  ) => {
    try {
      setLoading(true);
      const postQuery = isInitialLoad
        ? query(
            collection(db, "posts"),
            ...(selectedCategory && selectedCategory !== "all"
              ? [where("category", "==", selectedCategory)]
              : []),
            orderBy("date", "desc"),
            limit(POSTS_LIMIT)
          )
        : query(
            collection(db, "posts"),
            orderBy("date", "desc"),
            ...(selectedCategory && selectedCategory !== "all"
              ? [where("category", "==", selectedCategory)]
              : []),
            startAfter(lastDoc),
            limit(POSTS_LIMIT)
          );

      const querySnapshot = await getDocs(postQuery);
      const data = querySnapshot.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Post[];
      setPosts((prevPosts) => (isInitialLoad ? data : [...prevPosts, ...data]));
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchMoreData = () => {
    if (!loadingMore && lastDoc) {
      setLoadingMore(true);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [segments]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true, selectedCategory);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <CagegoryFilter
          setPosts={setPosts}
          setLoading={setLoading}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <SortedFilter />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
  );
}
