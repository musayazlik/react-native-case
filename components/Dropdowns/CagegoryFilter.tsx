import { View, Text } from "react-native";
import React from "react";
import { Label, YStack } from "tamagui";
import { SelectDemoItem } from "@/components/SelectDemo";
import { categoriesItems } from "@/data/index";
import { Post } from "@/types/post";
import { db } from "@firebase";
import {
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  where,
} from "@firebase/firestore";
import { POSTS_LIMIT } from "@/constants/Variables";
import { useState } from "react";

const CagegoryFilter = ({
  setPosts,
  setLoading,
  selectedCategory,
  setSelectedCategory,
}: {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchData = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      const postQuery = isInitialLoad
        ? query(
            collection(db, "posts"),
            ...(selectedCategory !== "all"
              ? [where("category", "==", selectedCategory)]
              : []),
            orderBy("date", "desc"),
            limit(POSTS_LIMIT)
          )
        : query(
            collection(db, "posts"),
            ...(selectedCategory !== "all"
              ? [where("category", "==", selectedCategory)]
              : []),
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

  React.useEffect(() => {
    fetchData(true);
  }, [selectedCategory]);

  return (
    <YStack flex={1}>
      <Label htmlFor="categories">Kategoriler</Label>
      <SelectDemoItem
        id="categories"
        items={categoriesItems}
        value={selectedCategory}
        onActiveChange={(value) => {
          if (value) {
            setSelectedCategory("all");
          }
        }}
        onValueChange={(value) => setSelectedCategory(value)}
        name="Kategoriler"
      />
    </YStack>
  );
};

export default CagegoryFilter;
