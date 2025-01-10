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

export enum Ordering {
  CHEAPEST = "price",
  NEWEST = "-created_at",
  MOST_EXPENSIVE = "-price",
  OLDEST = "created_at",
}
