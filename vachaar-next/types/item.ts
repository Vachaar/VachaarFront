export type Item = {
  id: number;
  title: string;
  description: string;
  category: number;
  image_ids: number[];
  price: number;
};

export type GetItemsResponse = {
  next: string | null;
  results: {
    items: Item[];
    max_price: number;
  };
};

export type ItemRequest = {
  id: number;
  buyer_user_phone: string;
  comment: string;
  state: string;
};

export enum Ordering {
  CHEAPEST = "price",
  NEWEST = "-created_at",
  MOST_EXPENSIVE = "-price",
  OLDEST = "created_at",
}

export enum ItemState {
  ReservedByMeItems = "reserved_by_user",
  BoughtByMeItems = "bought_by_user",
  MySoldItems = "sold_by_user",
  MyActiveItems = "created_by_user_active",
  MyReservedItems = "created_by_user_reserved",
}
