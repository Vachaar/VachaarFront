import { getItem } from "@/actions/item";
import { digitsToMoney, digitsToPersian } from "@/utils/string";
import Image from "next/image";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const item = await getItem(Number(id));
  return (
    <div className="flex items-center h-screen justify-center p-4">
      <div className="max-w-8xl h-full w-full px-2 lg:px-24">
        <div className="relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
            <p className="text-xl font-medium tracking-tight">
              {digitsToMoney(digitsToPersian(item.price.toString()))} تومان
            </p>
            <p className="text-medium text-default-500">{item.description}</p>
          </div>
          <div className="relative h-full w-full">
            <div className="h-[366px] w-full relative">
              <Image
                alt={item.title}
                fill
                className="object-cover rounded"
                src={
                  item.image_ids[0]
                    ? `/vachaar-api/product/images/${item.image_ids[0]}`
                    : "/images/no-image.jpg"
                }
              />
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto">
              {item.image_ids.map((image_id, index) => (
                <div key={index} className="h-24 w-24 flex-shrink-0 relative">
                  <Image
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                    src={`/vachaar-api/product/images/${image_id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
