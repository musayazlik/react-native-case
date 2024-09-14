import React, { useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { addDoc, collection } from "@firebase/firestore";
import { db, uploadToFirebase } from "@firebase";
import {
  Button,
  Form,
  H4,
  Spinner,
  Input,
  XStack,
  YStack,
  Label,
  H2,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { SelectDemoItem } from "@/components/SelectDemo";
import { categoriesItems } from "@/data/index";
import { router } from "expo-router";

const NewPost = () => {
  const [status, setStatus] = React.useState("off");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState({
    uri: "",
    name: "",
  });
  const createPost = async () => {
    try {
      const image_url = await uploadToFirebase(image.uri, image.name);
      if (!image_url) {
        return;
      }

      console.log("image_url", image_url);

      await addDoc(collection(db, "posts"), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: new Date(),
        image: image_url.url,
      });

      router.canGoBack();
      setFormData({
        title: "",
        description: "",
        category: "",
      });

      setStatus("off");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  console.log("formData", formData);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName ?? "",
      });
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <H2 textAlign="center" paddingVertical="$4">
        Yeni Post
      </H2>
      <Form
        alignItems="center"
        minWidth={300}
        onSubmit={() => createPost()}
        borderWidth={1}
        borderRadius="$4"
        backgroundColor="$background"
        borderColor="$borderColor"
        padding="$4"
      >
        <Form.Trigger
          asChild
          style={{
            flexDirection: "column",
          }}
        >
          <XStack width={"100%"}>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Bir başlık giriniz..."
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </XStack>
        </Form.Trigger>

        <Form.Trigger
          asChild
          style={{
            flexDirection: "column",
          }}
        >
          <XStack width={"100%"}>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Bir açıklama giriniz..."
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </XStack>
        </Form.Trigger>

        <Form.Trigger
          asChild
          style={{
            flexDirection: "column",
          }}
        >
          <XStack width={"100%"}>
            <View style={styles.imageWrapper}>
              {image.uri && (
                <Image source={{ uri: image.uri }} style={styles.image} />
              )}
            </View>

            <Label htmlFor="image">Image</Label>
            <Button theme="blue" onPress={pickImage}>
              Select Image
            </Button>
          </XStack>
        </Form.Trigger>

        <Form.Trigger
          asChild
          style={{
            flexDirection: "column",
          }}
        >
          <XStack width={"100%"}>
            <Label htmlFor="category">Category</Label>
            <SelectDemoItem
              items={categoriesItems}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  category: value,
                })
              }
            />
          </XStack>
        </Form.Trigger>

        <Form.Trigger
          asChild
          disabled={status !== "off"}
          style={styles.formButtonWrapper}
        >
          <Button
            width={"100%"}
            theme="green"
            borderRadius="$4"
            icon={status === "submitting" ? () => <Spinner /> : undefined}
          >
            Yeni İçeriği Oluştur
          </Button>
        </Form.Trigger>
      </Form>
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: 0,
    marginTop: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  formButtonWrapper: {
    marginTop: 20,
  },
});
