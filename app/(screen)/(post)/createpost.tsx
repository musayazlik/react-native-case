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
import { postsCreateStyles as styles } from "@/styles/Post";
import Toast from "react-native-toast-message";

const NewPost = () => {
  const [status, setStatus] = React.useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "education",
  });
  const [image, setImage] = useState({
    uri: "",
    name: "",
  });

  const createPost = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Tüm alanları doldurunuz",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
        position: "top",
      });
      return;
    }

    try {
      if (!image.uri) {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: "Resim seçiniz...",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 60,
          position: "top",
        });
        return;
      }

      setStatus(true);

      const image_url = await uploadToFirebase(image.uri, image.name);
      if (!image_url) {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: "Resim yüklenirken hata oluştu",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 60,
          position: "top",
        });
        setStatus(false);
        return;
      }
      await addDoc(collection(db, "posts"), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: new Date(),
        image: image_url.url,
      })
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Başarılı",
            text2: "Post başarıyla oluşturuldu",
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 60,
            position: "top",
          });

          // Formu sıfırlayın
          setFormData({
            title: "",
            description: "",
            category: "education",
          });

          setImage({
            uri: "",
            name: "",
          });

          router.push("/");
          setStatus(false);
        })
        .catch((error) => {
          console.error("Error adding post:", error);
          Toast.show({
            type: "error",
            text1: "Hata",
            text2: "Post oluşturulurken hata oluştu",
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 60,
            position: "top",
          });
          setStatus(false);
        });
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

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
              defaultValue={formData.title}
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
              defaultValue={formData.description}
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
            {image.uri && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.image} />
              </View>
            )}

            <Label>Image</Label>
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
            <Label>Category</Label>
            <SelectDemoItem
              defaultValue={formData.category}
              items={categoriesItems.filter((item) => item.key !== "all")}
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
          disabled={status == true}
          style={styles.formButtonWrapper}
        >
          <Button
            width={"100%"}
            onPress={createPost}
            theme="green"
            borderRadius="$4"
            icon={status === true ? () => <Spinner /> : undefined}
          >
            Yeni İçeriği Oluştur
          </Button>
        </Form.Trigger>
      </Form>
    </View>
  );
};

export default NewPost;
