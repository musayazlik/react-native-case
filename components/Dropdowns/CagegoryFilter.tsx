import React from "react";
import { Label, YStack } from "tamagui";
import { SelectDemoItem } from "@/components/SelectDemo";
import { categoriesItems } from "@/data/index";

const CagegoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
