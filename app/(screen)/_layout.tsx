import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0, top: 0 }}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#e11d48",
          position: "absolute",
          borderWidth: 2,
          borderTopColor: "#9f1239",
          borderTopWidth: 2,

          borderColor: "#9f1239",
          bottom: 20,
          height: 64,
          elevation: 0,
          width: "40%",
          borderRadius: 16,
          marginHorizontal: "30%",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={focused ? "#fff" : "#4c0519"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(post)/createpost"
        options={{
          title: "Yeni Gönderi",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={focused ? "#fff" : "#4c0519"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(post)/[id]"
        options={{
          title: "Profil",
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
