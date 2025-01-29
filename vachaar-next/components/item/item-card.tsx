import { Item } from "@/types/item";
import { digitsToMoney, digitsToPersian } from "@/utils/string";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  item: Item;
  showReservationsButton?: boolean;
}

export default function ItemCard(props: Props) {
  return (
    <Link href={`/item/${props.item.id}`} className="flex">
      <Card
        isPressable
        shadow="sm"
        aria-label="items list"
        className="flex-grow"
      >
        <CardBody className="overflow-visible p-0">
          <Image
            alt={props.item.title}
            className="w-full object-cover h-[140px]"
            radius="lg"
            shadow="sm"
            src={
              props.item.image_ids[0]
                ? `vachaar-api/product/images/${props.item.image_ids[0]}`
                : "/images/no-image.jpg"
            }
            width="100%"
          />
        </CardBody>
        <CardFooter className="text-small justify-between flex-col gap-2">
          <b className="line-clamp-2 min-h-[40px]">{props.item.title}</b>
          <p className="text-default-500">
            {digitsToPersian(digitsToMoney(props.item.price.toString()))} تومان
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
