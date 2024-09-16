import React from "react";
import { Label, YStack } from "tamagui";
import { SelectDemoItem } from "@/components/SelectDemo";
import { filtersItems } from "@/data/index";

const DateFilter = ({
  selectedDateItem,
  setSelectedDateItem,
}: {
  selectedDateItem: string;
  setSelectedDateItem: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <YStack flex={1}>
      <Label htmlFor="filters">Sırala</Label>
      <SelectDemoItem
        id="filters"
        value={selectedDateItem}
        items={filtersItems}
        onValueChange={(value) => {
          setSelectedDateItem(value);
        }}
        name="Sıralama"
      />
    </YStack>
  );
};

export default DateFilter;
