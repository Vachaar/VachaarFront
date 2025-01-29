export const dynamic = "force-dynamic";

import { getProfileItems } from "@/actions/item";
import MyItems from "@/components/item/my-items";
import { ItemState } from "@/types/item";

export default async function ProfilePage() {
  const response = await getProfileItems(ItemState.MyActiveItems);
  return <MyItems initialItems={response} />;
}
