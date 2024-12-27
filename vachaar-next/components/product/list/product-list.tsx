"use client";

import { ScrollShadow } from "@nextui-org/react";
import products from "@/data/products";
import ProductListItem from "./product-list-item";

export const ProductList = () => {
  return (
    <div className="my-auto flex w-full max-w-7xl flex-col items-start gap-2">
      <ScrollShadow
        className="-mx-6 -my-5 flex w-full max-w-full snap-x justify-start gap-6 px-6 py-5"
        orientation="horizontal"
        size={20}
      >
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            {...product}
            className="snap-start"
          />
        ))}
      </ScrollShadow>
    </div>
  );
};