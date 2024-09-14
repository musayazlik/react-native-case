import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { db } from "@firebase";
import { ref } from "firebase/storage";

const PostDetail = () => {
  const postId = useLocalSearchParams();
  const [data, setData] = React.useState<any | null>(null);

  useEffect(() => {
    if (!postId) return; // Eğer postId boşsa sorgu yapma.

    console.log("Fetching post with ID:", postId);

    const fetchPost = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const singlePost = doc(postsCollection, postId.id.toString());
        const postSnapshot = await getDoc(singlePost);
        const data = postSnapshot.data();
        console.log("Post data:", data);
        setData(data || null);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, []);

  return (
    <View>
      <Text>PostDetail</Text>
    </View>
  );
};

export default PostDetail;
