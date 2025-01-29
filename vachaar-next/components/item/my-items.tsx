"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { Item, ItemState } from "@/types/item";
import ItemCard from "./item-card";
import { getProfileItems } from "@/actions/item";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  initialItems: Item[];
}

export default function MyItems(props: Props) {
  const [selectedState, setSelectedState] = useState(ItemState.MyActiveItems);

  const [items, setItems] = useState<
    Record<ItemState, { label: string; items?: Item[] }>
  >({
    [ItemState.MyActiveItems]: {
      label: "آگهی های فعال من",
      items: props.initialItems,
    },
    [ItemState.MyReservedItems]: {
      label: "آگهی های رزرو شدۀ من",
    },
    [ItemState.MySoldItems]: {
      label: "آگهی های فروخته شدۀ من",
    },
    [ItemState.BoughtByMeItems]: {
      label: "خرید های من",
    },
    [ItemState.ReservedByMeItems]: {
      label: "رزرو های من",
    },
  });

  const loadProfileItems = async () => {
    let response;
    try {
      response = await getProfileItems(selectedState);
    } catch (error: unknown) {
      toast.error("خطایی در دریافت آگهی ها رخ داده است.");
      return;
    }
    setItems((items) => {
      return {
        ...items,
        [selectedState]: { ...items[selectedState], items: response },
      };
    });
  };

  useEffect(() => {
    if (!items[selectedState].items) {
      loadProfileItems();
    }
  }, [selectedState]);

  const itemsArray = useMemo(() => {
    return Object.entries(items).map(([key, value]) => ({
      key,
      value,
    }));
  }, [items]);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Dynamic tabs"
        items={itemsArray}
        selectedKey={selectedState}
        onSelectionChange={(key) => setSelectedState(key as ItemState)}
      >
        {(tab) => (
          <Tab key={tab.key} title={tab.value.label}>
            <div className="gap-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
              {tab.value.items?.map?.((item) => (
                <div key={item.id} className="flex flex-col gap-4">
                  <ItemCard item={item} showReservationsButton />
                  {[
                    ItemState.MyActiveItems,
                    ItemState.MyReservedItems,
                    ItemState.MySoldItems,
                  ].includes(tab.key as ItemState) && (
                    <Link
                      href={
                        `/profile/item/${item.id}` +
                        (tab.key === ItemState.MySoldItems ? "?sold=true" : "")
                      }
                    >
                      <Button className="w-full">مشاهدۀ درخواست‌ها</Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
