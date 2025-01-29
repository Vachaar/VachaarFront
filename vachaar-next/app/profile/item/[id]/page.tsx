import { getItem, getItemRequests } from "@/actions/item";
import ItemRequests from "@/components/item/item-requests";
export default async function ProfileItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sold: string }>;
}) {
  const id = (await params).id;
  const sold = (await searchParams).sold;
  const requests = await getItemRequests(id);
  const item = await getItem(id);
  return (
    <div className="flex w-full flex-col">
      <ItemRequests
        requests={requests}
        itemID={id}
        itemTitle={item.title}
        isSold={sold == "true"}
      />
    </div>
  );
}
