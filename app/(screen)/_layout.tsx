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
        tabBarItemStyle: {},
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          position: "absolute",
          borderWidth: 1,
          borderColor: "#ccc",
          bottom: 24,
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
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="newpost"
        options={{
          title: "Yeni Gönderi",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
