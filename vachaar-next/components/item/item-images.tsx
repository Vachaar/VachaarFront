"use client";

import { Item } from "@/types/item";
import Image from "next/image";
import { useState } from "react";

interface Props {
  item: Item;
}

const ItemImages: React.FC<Props> = (props) => {
  const [selectedImage, setSelectedImage] = useState<number>(
    props.item.image_ids[0]
  );
  return (
    <div>
      <div className="h-[366px] w-full relative">
        <Image
          alt={props.item.title}
          fill
          className="object-cover rounded"
          src={
            selectedImage
              ? `/vachaar-api/product/images/${selectedImage}`
              : "/images/no-image.jpg"
          }
        />
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto">
        {props.item.image_ids.map((image_id, index) => (
          <div
            key={index}
            className="h-24 w-24 flex-shrink-0 relative cursor-pointer"
            onClick={() => setSelectedImage(image_id)}
          >
            <Image
              alt={props.item.title}
              fill
              className="object-cover rounded"
              src={`/vachaar-api/product/images/${image_id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemImages;
