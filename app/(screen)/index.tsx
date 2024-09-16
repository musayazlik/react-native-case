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
import SortedFilter from "@/components/Dropdowns/DateFilter";
import { categoriesItems, filtersItems } from "@/data/index";
import getDateRange from "@/helpers/getDataRange";
export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDateItem, setSelectedDateItem] = useState<string>("all");
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const POSTS_LIMIT = 5;
  const segments = useSegments();

  const fetchData = async (isInitialLoad = false) => {
    // Tarih filtresini ayarla
    const findDateItem = await filtersItems.find(
      (item) => item.key === selectedDateItem
    )?.key;

    const { startDate, endDate } = await getDateRange(findDateItem || "all");

    try {
      setLoading(true);

      const postQuery = isInitialLoad
        ? query(
            collection(db, "posts"),
            ...(selectedCategory !== "all"
              ? [where("category", "==", selectedCategory)]
              : []),
            ...(selectedDateItem !== "all"
              ? [where("date", ">=", startDate), where("date", "<=", endDate)]
              : []),

            orderBy("date", "desc"),
            limit(POSTS_LIMIT)
          )
        : query(
            collection(db, "posts"),
            ...(selectedCategory !== "all"
              ? [where("category", "==", selectedCategory)]
              : []),
            ...(selectedDateItem !== "all"
              ? [where("date", ">=", startDate), where("date", "<=", endDate)]
              : []),
            orderBy("date", "desc"),
            startAfter(lastDoc),
            limit(POSTS_LIMIT)
          );

      const querySnapshot = await getDocs(postQuery);
      const data = querySnapshot.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...doc.data(),
        category: categoriesItems.find(
          (item) => item.key === doc.data().category
        )?.value,
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

  useEffect(() => {
    fetchData(true);
  }, [selectedCategory, selectedDateItem]);

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <CagegoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <SortedFilter
          selectedDateItem={selectedDateItem}
          setSelectedDateItem={setSelectedDateItem}
        />
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
