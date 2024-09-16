import { View } from "react-native";
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
import { Image } from "react-native-expo-image-cache";
import { Post } from "@/types/post";
import { Paragraph, Text } from "tamagui";
import { Timestamp } from "firebase/firestore";
import formatDateFromTimestamp from "@/helpers/formatDateFromTimestamp";
import { categoriesItems } from "@/data/index";
import { ICategoryProps } from "@/types/category";

const PostDetail = () => {
  const postId = useLocalSearchParams();
  const [data, setData] = React.useState<Post | null>(null);

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const singlePost = doc(postsCollection, postId.id.toString());
        const postSnapshot = await getDoc(singlePost);
        const data = postSnapshot.data();

        const replaceData = {
          ...data,
          category:
            categoriesItems.find(
              (item: ICategoryProps) => item.key === data?.category
            )?.value || "",
          date: formatDateFromTimestamp(data?.date as Timestamp) || "",
        };
        setData(replaceData as Post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, []);

  const preview = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "semibold",
          backgroundColor: "#e11d48",
          color: "white",
          textAlign: "center",
          paddingVertical: 10,
        }}
      >
        {data?.title}
      </Text>
      <View style={{ padding: 10 }}>
        <Image
          style={{
            width: "100%",
            height: 300,
            borderRadius: 10,
          }}
          uri={data?.image || ""}
          preview={preview}
          tint="light"
        />

        <View
          style={{
            padding: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            display: "flex",

            alignItems: "center",
            backgroundColor: "#e11d48",
            marginTop: 10,
            borderRadius: 4,
            borderStartColor: "#9f1239",
            borderStartWidth: 4,
            borderEndColor: "#9f1239",
            borderEndWidth: 4,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              paddingVertical: 5,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {data?.category}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "white",
            }}
          >
            {data?.date}
          </Text>
        </View>

        <Paragraph
          style={{
            fontSize: 16,
            color: "$text",
            padding: 10,
          }}
        >
          {data?.description}
        </Paragraph>
      </View>
    </View>
  );
};

export default PostDetail;
