import { getItem } from "@/actions/item";
import ContactInfo from "@/components/item/contact-info";
import DeleteItem from "@/components/item/delete-item";
import EditItem from "@/components/item/edit-item";
import ItemImages from "@/components/item/item-images";
import PurchaseRequest from "@/components/item/purchase-request";
import Report from "@/components/report/report";
import { digitsToMoney, digitsToPersian } from "@/utils/string";
export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const item = await getItem(id);
  return (
    <div className="flex justify-center p-4">
      <div className="max-w-8xl h-full w-full px-2 lg:px-24">
        <div
          dir="ltr"
          className="relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8"
        >
          <div dir="rtl" className="relative h-full w-full">
            <ItemImages item={item} />
          </div>
          <div dir="rtl" className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
            <p className="text-xl font-medium tracking-tight">
              {digitsToPersian(digitsToMoney(item.price.toString()))} تومان
            </p>
            <div className="flex gap-4">
              {item.is_owner ? (
                <>
                  <EditItem id={id} />
                  <DeleteItem id={id} />
                </>
              ) : (
                <>
                  <ContactInfo id={id} />
                  <PurchaseRequest id={id} />
                </>
              )}
            </div>
            <p className="text-medium text-default-500">{item.description}</p>
            {!item.is_owner && <Report id={id} />}
          </div>
        </div>
      </div>
    </div>
  );
}
