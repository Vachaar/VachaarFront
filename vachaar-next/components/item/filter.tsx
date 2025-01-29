"use client";

import { SearchIcon } from "@/components/icons";
import { categories } from "@/data/config";
import { Ordering } from "@/types/item";
import { digitsToMoney, digitsToPersian } from "@/utils/string";
import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Slider,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const orderings = [
  { label: "جدید ترین", value: Ordering.NEWEST },
  { label: "ارزان ترین", value: Ordering.CHEAPEST },
  { label: "گران ترین", value: Ordering.MOST_EXPENSIVE },
  { label: "قدیمی ترین", value: Ordering.OLDEST },
];

interface Props {
  maxPrice: number;
}

export const Filter = (props: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const selectedCategory = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : undefined;
  const ordering = (searchParams.get("ordering") ||
    Ordering.NEWEST) as Ordering;
  const price__gte = searchParams.get("price__gte")
    ? Number(searchParams.get("price__gte"))
    : undefined;
  const price__lte = searchParams.get("price__lte")
    ? Number(searchParams.get("price__lte"))
    : undefined;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const defaultPriceRange: [number, number] = [0, props.maxPrice];
  const [priceRangePreview, setPriceRangePreview] =
    useState<[number, number]>(defaultPriceRange);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  const handleSelectOrdering = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ordering = e.target.value as Ordering;
    const params = new URLSearchParams(searchParams);
    params.set("ordering", ordering);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSetPriceRange = () => {
    const params = new URLSearchParams(searchParams);
    params.set("price__gte", priceRangePreview[0].toString());
    params.set("price__lte", priceRangePreview[1].toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const createCategoryURL = (categoryID: number) => {
    const params = new URLSearchParams(searchParams);
    if (params.get("category") === categoryID.toString()) {
      params.delete("category");
    } else {
      params.set("category", categoryID.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="flex mb-8 gap-4 flex-wrap sm:justify-center">
        {categories.map((category) => (
          <Link key={category.id} href={createCategoryURL(category.id)}>
            <Chip
              startContent={
                <Icon
                  className={
                    "pointer-events-none text-xl" +
                    (selectedCategory == category.id
                      ? "text-white"
                      : "text-default-400")
                  }
                  icon={`solar:${category.icon}`}
                />
              }
              variant={selectedCategory == category.id ? "solid" : "bordered"}
              color={selectedCategory == category.id ? "secondary" : "default"}
              className="cursor-pointer"
            >
              {category.title}
            </Chip>
          </Link>
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
          onValueChange={handleSearch}
          defaultValue={searchParams.get("search")?.toString()}
        />
        <Button
          onPress={() => {
            setPriceRangePreview([
              price__gte ?? 0,
              price__lte ?? props.maxPrice,
            ]);
            onOpen();
          }}
          className="flex-shrink-0"
        >
          {!price__gte && !price__lte && <>محدودۀ قیمت</>}
          {price__gte !== undefined && (
            <>{`از ${digitsToPersian(digitsToMoney(`${price__gte} تومان`))}`}</>
          )}
          {price__lte !== undefined && (
            <>{` تا ${digitsToPersian(digitsToMoney(`${price__lte} تومان`))}`}</>
          )}
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
                        digitsToMoney(`${priceRangePreview[1]} تومان`)
                      )}
                    </p>
                    <p>
                      {digitsToPersian(
                        digitsToMoney(`${priceRangePreview[0]} تومان`)
                      )}
                    </p>
                  </div>
                  <Slider
                    className="max-w-md"
                    aria-label="Price Range"
                    maxValue={Math.max(props.maxPrice, price__lte ?? 0)}
                    minValue={0}
                    step={1000}
                    value={priceRangePreview}
                    onChange={(value) =>
                      setPriceRangePreview(value as [number, number])
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
                      handleSetPriceRange();
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
          defaultSelectedKeys={[ordering]}
          aria-label="ordering"
          onChange={handleSelectOrdering}
        >
          {orderings.map((ordering) => (
            <SelectItem key={ordering.value} value={ordering.value}>
              {ordering.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
};
