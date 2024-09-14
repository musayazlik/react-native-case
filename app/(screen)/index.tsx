import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { db } from "@firebase";
import {
  getDocs,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
} from "@firebase/firestore";
import { Button, Card, H2, Paragraph, XStack, Label, YStack } from "tamagui";
import { Post } from "@/types/post";
import { SelectDemoItem } from "@/components/SelectDemo";
import CardItem from "@/components/CardItem";
import { categoriesItems, filtersItems } from "@/data/index";
export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const POSTS_LIMIT = 5;
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
  }, []);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,

    textAlign: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },

  filterWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
    gap: 20,
    justifyContent: "space-between",
  },
});
