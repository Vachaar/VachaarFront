"use client";

import { Item } from "@/types/item";
import { Image } from "@nextui-org/react";
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
      <Image
        alt={props.item.title}
        className="object-cover rounded h-[280px] w-full md:h-[366px]"
        src={
          selectedImage
            ? `/vachaar-api/product/images/${selectedImage}`
            : "/images/no-image.jpg"
        }
      />
      <div className="mt-4 flex gap-4 overflow-x-auto">
        {props.item.image_ids.map((image_id) => (
          <Image
            key={image_id}
            alt={props.item.title}
            className="object-cover rounded h-24 w-24 flex-shrink-0 relative cursor-pointer"
            src={`/vachaar-api/product/images/${image_id}`}
            onClick={() => setSelectedImage(image_id)}
            role="button"
          />
        ))}
      </div>
    </div>
  );
};

export default ItemImages;
