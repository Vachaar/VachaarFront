"use server";

import { GetItemsResponse, Item, Ordering } from "@/types/item";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : process.env.NEXT_PUBLIC_BASE_URL;

export const getItems = async (
  page: number,
  search?: string,
  category?: number,
  price__gte?: number,
  price__lte?: number,
  ordering?: Ordering
) => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  if (search) {
    params.set("search", search);
  }
  if (category) {
    params.set("category", category.toString());
  }
  if (ordering) {
    params.set("ordering", ordering);
  }
  if (price__gte) {
    params.set("price__gte", price__gte.toString());
  }
  if (price__lte) {
    params.set("price__lte", price__lte.toString());
  }
  try {
    const url = `${baseURL}/product/items?${params.toString()}`;
    const response = await fetch(url);
    const data = (await response.json()) as GetItemsResponse;
    return data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const getItem = async (id: number) => {
  const response = await fetch(`${baseURL}/product/items/${id}`);
  const data = await response.json();
  return data as Item;
};
