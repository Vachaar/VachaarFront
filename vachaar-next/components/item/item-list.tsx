"use client";

import { getItems } from "@/actions/item";
import { Item, Ordering } from "@/types/item";
import { Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import ItemCard from "./item-card";

type Props = {
  initialItems: Item[];
  hasMore: boolean;
  search: string | undefined;
  category: number | undefined;
  ordering: Ordering | undefined;
  price__gte: number | undefined;
  price__lte: number | undefined;
  onMaxPriceChange: (maxPrice: number) => void;
};

export default function ItemList(props: Props) {
  const [items, setItems] = useState(props.initialItems);
  const [page, setPage] = useState(2);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(props.hasMore);

  const loadMoreItems = async (isInitial?: boolean) => {
    let response;
    try {
      response = await getItems(
        isInitial ? 1 : page,
        props.search,
        props.category,
        props.price__gte,
        props.price__lte,
        props.ordering
      );
    } catch (error: unknown) {
      toast.error("خطایی در دریافت آگهی ها رخ داده است.");
      return;
    }
    if (response.results.max_price) {
      props.onMaxPriceChange(response.results.max_price);
    }
    const fetchedItems = response.results.items;
    if (!response.next) {
      setHasMore(false);
    }
    if (isInitial) {
      setPage(2);
      setItems(fetchedItems);
      if (response.next) {
        setHasMore(true);
      }
    } else {
      setPage((page) => page + 1);
      setItems((items) => [...items, ...fetchedItems]);
    }
  };

  const mount = useRef<boolean>();

  useEffect(() => {
    if (inView && mount.current) {
      loadMoreItems();
    }
  }, [inView]);

  useEffect(() => {
    if (mount.current) {
      setPage(1);
      loadMoreItems(true);
    }
  }, [
    props.search,
    props.category,
    props.price__lte,
    props.price__gte,
    props.ordering,
  ]);

  useEffect(() => {
    mount.current = true;
  }, []);

  return (
    <>
      {items.length === 0 && (
        <p className="text-center text-default-500">موردی یافت نشد</p>
      )}
      <div className="gap-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
        {items?.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
      {hasMore && <Spinner ref={ref} />}
    </>
  );
}
