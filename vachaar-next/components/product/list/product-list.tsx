"use client";

import { SearchIcon } from "@/components/icons";
import { categories } from "@/data/config";
import { makeRequest } from "@/utils/request";
import { digitsToMoney, digitsToPersian } from "@/utils/string";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Slider,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

type Item = {
  id: number;
  title: string;
  description: string;
  category_id: number;
  image_ids: number[];
  price: number;
};

enum Order {
  CHEAPEST = "price",
  NEWEST = "-created_at",
  MOST_EXPENSIVE = "-price",
  OLDEST = "created_at",
}

const orders = [
  { label: "جدید ترین", value: Order.NEWEST },
  { label: "ارزان ترین", value: Order.CHEAPEST },
  { label: "گران ترین", value: Order.MOST_EXPENSIVE },
  { label: "قدیمی ترین", value: Order.OLDEST },
];

export const ProductList = () => {
  const [list, setList] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order>(Order.NEWEST);
  const [categoryID, setCategoryID] = useState<number>();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const defaultPriceRange = [0, maxPrice];
  const [tempPriceRange, setTempPriceRange] = useState(defaultPriceRange);
  const [priceRange, setPriceRange] = useState(defaultPriceRange);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageRef = useRef(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getItems = useCallback(
    (page: number) => {
      setLoading(true);
      makeRequest(
        `product/items?page=${page}&search=${debouncedQuery}&ordering=${order}&category=${categoryID ?? ""}&price__gte=${!maxPrice ? "" : priceRange[0]}&price__lte=${!maxPrice ? "" : priceRange[1]}`,
        {
          method: "GET",
        },
        {
          onSuccess: (res) => {
            res.json().then((data) => {
              if (data.results.max_price) setMaxPrice(data.results.max_price);
              setList((prevList) => {
                if (page == 1) return data.results.items;
                return [...prevList, ...data.results.items];
              });
              if (!data.next) setHasMore(false);
            });
          },
          onError: () => {
            toast.error(
              "خطایی در دریافت آگهی ها رخ داده است. لطفا صفحه را مجددا بارگذاری کنید."
            );
            setHasMore(false);
          },
          finally: () => {
            setLoading(false);
          },
        }
      );
    },
    [debouncedQuery, order, categoryID, priceRange]
  );

  useEffect(() => {
    setHasMore(true);
    pageRef.current = 1;
    getItems(1);
  }, [debouncedQuery, order, categoryID, priceRange]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!loading && hasMore) {
            getItems(pageRef.current);
            pageRef.current += 1;
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [getItems, loading, hasMore]
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

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
        <Button
          onPress={() => {
            if (priceRange[1] >= maxPrice || !priceRange[1]) {
              setPriceRange([priceRange[0], maxPrice]);
              setTempPriceRange([priceRange[0], maxPrice]);
            } else {
              setTempPriceRange(priceRange);
            }
            onOpen();
          }}
          className="flex-shrink-0"
        >
          {priceRange.toString() === defaultPriceRange.toString() ||
          !priceRange[1]
            ? "محدودۀ قیمت"
            : `از ${digitsToPersian(digitsToMoney(`${priceRange[0]} تومان`))} تا ${digitsToPersian(digitsToMoney(`${priceRange[1]} تومان`))}`}
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  تعیین محدودۀ قیمت
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-between">
                    <p>
                      {digitsToPersian(
                        digitsToMoney(`${tempPriceRange[1]} تومان`)
                      )}
                    </p>
                    <p>
                      {digitsToPersian(
                        digitsToMoney(`${tempPriceRange[0]} تومان`)
                      )}
                    </p>
                  </div>
                  <Slider
                    className="max-w-md"
                    defaultValue={defaultPriceRange}
                    aria-label="Price Range"
                    maxValue={maxPrice}
                    minValue={0}
                    step={1000}
                    value={tempPriceRange}
                    onChange={(value) =>
                      setTempPriceRange(value as [number, number])
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    بستن
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      setPriceRange(tempPriceRange);
                      onClose();
                    }}
                  >
                    اعمال
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
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
            aria-label="items list"
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
                {digitsToPersian(item.price.toString())} تومان
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
      {hasMore && <Spinner ref={lastItemRef} />}
    </>
  );
};
