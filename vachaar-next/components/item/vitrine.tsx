"use client";

import { useState } from "react";
import { Filter } from "./filter";
import ItemList from "./item-list";
import { Item, Ordering } from "@/types/item";

interface Props {
  initialMaxPrice: number;
  initialItems: Item[];
  hasMore: boolean;
  search: string | undefined;
  category: number | undefined;
  ordering: Ordering | undefined;
  price__gte: number | undefined;
  price__lte: number | undefined;
}

export const Vitrine = (props: Props) => {
  const [maxPrice, setMaxPrice] = useState(props.initialMaxPrice);
  return (
    <div className="inline-block text-center justify-center w-full">
      <Filter maxPrice={maxPrice} />
      <ItemList
        {...props}
        onMaxPriceChange={(maxPrice: number) => setMaxPrice(maxPrice)}
      />
    </div>
  );
};
