import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Post } from "@/types/post";
import { Card, H2, Paragraph, Button, XStack } from "tamagui";
import { router } from "expo-router";
import { Image } from "expo-image";

const CardItem = ({ item }: { item: Post }) => {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <Card
      elevate
      size="$4"
      bordered
      backgroundColor={"$white05"}
      style={styles.card}
    >
      <Card.Header padded>
        <View style={styles.headerTitleCategory}>
          <H2 fontSize={20}>{item.title}</H2>
          <Text>{item.category}</Text>
        </View>
        <Paragraph theme="alt2">
          {new Date(item.date).toLocaleDateString()}
        </Paragraph>
      </Card.Header>
      <View style={styles.cardContent}>
        <Image
          style={styles.image}
          source={{
            uri: item.image,
          }}
          transition={1400}
          placeholder={{ blurhash }}
          contentFit="cover"
          cachePolicy={"memory-disk"}
        />
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Card.Footer padded>
        <XStack justifyContent="flex-end">
          <Button
            borderRadius="$10"
            theme="blue"
            onPress={() => {
              router.push(`/(post)/${item.id}`);
            }}
          >
            Read More
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 0,
    marginVertical: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
    paddingHorizontal: 15,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  headerTitleCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
