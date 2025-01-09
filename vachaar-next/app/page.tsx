import { getItems } from "@/actions/item";
import { Vitrine } from "@/components/item/vitrine";
import { Ordering } from "@/types/item";

export default async function Home(props: {
  searchParams?: Promise<{
    search?: string;
    category?: number;
    price__gte?: number;
    price__lte?: number;
    ordering?: Ordering;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search;
  const category = searchParams?.category;
  const price__gte = searchParams?.price__gte;
  const price__lte = searchParams?.price__lte;
  const ordering = searchParams?.ordering;
  const response = await getItems(
    1,
    search,
    category,
    price__gte,
    price__lte,
    ordering
  );
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center w-full">
        <Vitrine
          initialMaxPrice={response.results.max_price}
          initialItems={response.results.items}
          hasMore={!!response.next}
          search={search}
          category={category}
          price__gte={price__gte}
          price__lte={price__lte}
          ordering={ordering}
        />
      </div>
    </section>
  );
}
