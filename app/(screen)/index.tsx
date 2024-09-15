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
  DocumentData,
} from "@firebase/firestore";
import { Label, YStack } from "tamagui";
import { Post } from "@/types/post";
import { SelectDemoItem } from "@/components/SelectDemo";
import CardItem from "@/components/CardItem";
import { categoriesItems, filtersItems } from "@/data/index";
import { useSegments } from "expo-router";
import { postsIndexStyles as styles } from "@/styles/Post";
export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const POSTS_LIMIT = 5;
  const segments = useSegments();
  const fetchData = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      const postQuery = isInitialLoad
        ? query(
            collection(db, "posts"),
            orderBy("date", "desc"),
            limit(POSTS_LIMIT)
          )
        : query(
            collection(db, "posts"),
            orderBy("date", "desc"),
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
    fetchData(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Home Screen</Text>
      </View>
      <View style={styles.filterWrapper}>
        <YStack flex={1}>
          <Label htmlFor="categories">Kategoriler</Label>
          <SelectDemoItem
            id="categories"
            items={categoriesItems}
            name="Kategoriler"
          />
        </YStack>
        <YStack flex={1}>
          <Label htmlFor="filters">Sırala</Label>
          <SelectDemoItem id="filters" items={filtersItems} name="Sıralama" />
        </YStack>
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
