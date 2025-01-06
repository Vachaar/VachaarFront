"use client";

import { SearchIcon } from "@/components/icons";
import { categories } from "@/data/mock-data";
import { makeRequest } from "@/utils/request";
import { digitsToPersian } from "@/utils/string";
import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

type Item = {
  id: number;
  title: string;
  description: string;
  category_id: number;
  image_ids: number[];
  price: string;
};

enum Order {
  PRICE = "price",
  DATE = "date",
}

const orders = [
  { label: "جدید ترین", value: Order.DATE },
  { label: "ارزان ترین", value: Order.PRICE },
];

export const ProductList = () => {
  const [list, setList] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order>(Order.DATE);
  const [categoryID, setCategoryID] = useState<number>();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageRef = useRef(1);

  const getItems = useCallback(
    (page: number) => {
      setLoading(true);
      makeRequest(
        `product/items?page=${page}&search=${debouncedQuery}&ordering=${order}&category_id=${categoryID}`,
        {
          method: "GET",
        },
        {
          onSuccess: (res) => {
            res.json().then((data) => {
              setList((prevList) => {
                if (page == 1) return data.results;
                return [...prevList, ...data.results];
              });
              if (!data.next) setHasMore(false);
            });
          },
          onError: (error) => {
            console.log(error);
          },
          finally: () => {
            setLoading(false);
          },
        }
      );
    },
    [debouncedQuery, order, categoryID, loading]
  );

  useEffect(() => {
    setHasMore(true);
    pageRef.current = 1;
    getItems(1);
  }, [debouncedQuery, order, categoryID]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!loading) {
            getItems(pageRef.current);
            pageRef.current += 1;
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [getItems, loading]
  );

  return (
    <>
      <div className="flex mb-8 gap-4 flex-wrap sm:justify-center">
        {categories.map((category) => (
          <Chip
            startContent={
              <Icon
                className={
                  "pointer-events-none text-xl" +
                  (categoryID == category.id
                    ? "text-white"
                    : "text-default-400")
                }
                icon={`solar:${category.icon}`}
              />
            }
            variant={categoryID == category.id ? "solid" : "bordered"}
            color={categoryID == category.id ? "secondary" : "default"}
            key={category.id}
            className="cursor-pointer"
            onClick={() =>
              setCategoryID((categoryID) =>
                categoryID == category.id ? undefined : category.id
              )
            }
          >
            {category.title}
          </Chip>
        ))}
      </div>
      <div className="flex justify-start mb-8 align-center gap-4 flex-col sm:flex-row sm:gap-8">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          labelPlacement="outside"
          placeholder="جست‌وجو..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
          value={query}
          onValueChange={setQuery}
        />
        <Select
          isRequired
          variant="bordered"
          className="sm:w-1/3"
          onChange={(e) => setOrder(e.target.value as Order)}
          value={order}
          defaultSelectedKeys={[order]}
          aria-label="order"
        >
          {orders.map((order) => (
            <SelectItem key={order.value} value={order.value}>
              {order.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      {list.length === 0 && !loading && (
        <p className="text-center text-default-500">موردی یافت نشد</p>
      )}
      <div className="gap-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
        {list?.map((item, index) => (
          <Card
            key={index}
            isPressable
            shadow="sm"
            onPress={() => console.log("item pressed")}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item.title}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={
                  item.image_ids[0]
                    ? `vachaar-api/product/images/${item.image_ids[0]}`
                    : "/images/no-image.jpg"
                }
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small justify-between flex-col gap-2">
              <b className="line-clamp-2">{item.title}</b>
              <p className="text-default-500">
                {digitsToPersian(item.price)} تومان
              </p>
            </CardFooter>
          </Card>
        ))}
        {hasMore && <Spinner ref={lastItemRef} />}
      </div>
    </>
  );
};
