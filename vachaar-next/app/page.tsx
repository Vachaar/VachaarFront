import { ProductList } from "@/components/product/list/product-list";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <ProductList />
      </div>
    </section>
  );
}
