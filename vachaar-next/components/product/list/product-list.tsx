"use client";

import { makeRequest } from "@/utils/request";
import { digitsToPersian } from "@/utils/string";
import { Card, CardBody, CardFooter, Image, Spinner } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Item = {
  id: number;
  title: string;
  description: string;
  category_id: number;
  image_ids: number[];
  price: string;
};

export const ProductList = () => {
  const [list, setList] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const getItems = (page: number) => {
    makeRequest(
      `product/items?page=${page}`,
      {
        method: "GET",
      },
      {
        onSuccess: (res) => {
          res.json().then((data) => {
            setList((prevList) => [...prevList, ...data.results]);
            if (!data.next) setLoading(false);
          });
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  useEffect(() => {
    getItems(page);
  }, [page]);

  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  return (
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
      {loading && <Spinner ref={lastItemRef} />}
    </div>
  );
};
