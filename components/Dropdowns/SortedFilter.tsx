import { View, Text } from "react-native";
import React from "react";
import { Label, YStack } from "tamagui";
import { SelectDemoItem } from "@/components/SelectDemo";
import { filtersItems } from "@/data/index";

const SortedFilter = () => {
  return (
    <YStack flex={1}>
      <Label htmlFor="filters">Sırala</Label>
      <SelectDemoItem id="filters" items={filtersItems} name="Sıralama" />
    </YStack>
  );
};

export default SortedFilter;
