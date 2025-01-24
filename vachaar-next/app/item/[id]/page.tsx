import { getItem } from "@/actions/item";
import ContactInfo from "@/components/item/contact-info";
import ItemImages from "@/components/item/item-images";
import { digitsToMoney, digitsToPersian } from "@/utils/string";
export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const item = await getItem(id);
  return (
    <div className="flex items-center h-screen justify-center p-4">
      <div className="max-w-8xl h-full w-full px-2 lg:px-24">
        <div className="relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
            <p className="text-xl font-medium tracking-tight">
              {digitsToMoney(digitsToPersian(item.price.toString()))} تومان
            </p>
            <ContactInfo id={id} />
            <p className="text-medium text-default-500">{item.description}</p>
          </div>
          <div className="relative h-full w-full">
            <ItemImages item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
