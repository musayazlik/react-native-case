import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
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
import { Button, Card, H2, Paragraph, XStack } from "tamagui";
import { Post } from "@/types/post";
import { Plus } from "@tamagui/lucide-icons";

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

  const createPost = async () => {
    try {
      await addDoc(collection(db, "posts"), {
        title: "Yeni Post",
        description: "Bu bir açıklamadır.",
        date: new Date(),
        image_url: "https://images.unsplash.com/photo-1548142813-c348350df52b",
      });
      fetchData(true);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <Card
      elevate
      size="$4"
      bordered
      backgroundColor={"$white05"}
      style={styles.card}
    >
      <Card.Header padded>
        <H2>{item.title}</H2>
        <Paragraph theme="alt2">
          {new Date(item.date).toLocaleDateString()}
        </Paragraph>
      </Card.Header>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Card.Footer padded>
        <XStack justifyContent="flex-end">
          <Button borderRadius="$10" theme="blue">
            Read More
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Home Screen</Text>
        <Button
          variant="outlined"
          icon={<Plus size={20} />}
          onPress={createPost}
          theme={"blue_alt1"}
          forceStyle="hover"
        >
          New Post
        </Button>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.1}
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
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
});
