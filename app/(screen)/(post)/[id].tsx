import { View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc } from "@firebase/firestore";
import { db } from "@firebase";
import { Image } from "expo-image";
import { Post } from "@/types/post";
import { Paragraph, Text } from "tamagui";
import { Timestamp } from "firebase/firestore";
import formatDateFromTimestamp from "@/helpers/formatDateFromTimestamp";
import { categoriesItems } from "@/data/index";
import { ICategoryProps } from "@/types/category";
import { postsDetailStyles as styles } from "@/styles/Post/index";

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
  }, [postId]);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View>
      <Text style={styles.title}>{data?.title}</Text>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: data?.image }}
          placeholder={{ blurhash }}
          transition={200}
          contentFit="cover"
          cachePolicy={"memory"}
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{data?.category}</Text>
          <Text style={styles.date}>{data?.date}</Text>
        </View>

        <Paragraph style={styles.description}>{data?.description}</Paragraph>
      </View>
    </View>
  );
};

export default PostDetail;
