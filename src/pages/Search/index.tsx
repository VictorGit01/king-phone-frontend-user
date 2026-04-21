import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { CategoryNav } from "../../components/CategoryNav";
import { Product } from "../../components/Product";
import { useProducts } from "../../hooks/useFetch";

export const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = (searchParams.get("query") ?? "").trim();

  const { data: products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products || !searchTerm) return [];

    const searchTermLowerCase = searchTerm.toLowerCase();

    return products.filter((product) =>
      (product.name ?? "").toLowerCase().includes(searchTermLowerCase)
    );
  }, [products, searchTerm]);

  const titleText = useMemo(() => {
    if (!searchTerm) return "digite algo para buscar";
    if (loading) return `buscando por ${searchTerm}...`;
    if (error) return `erro ao buscar por ${searchTerm}`;

    return filteredProducts.length > 0
      ? `${filteredProducts.length} ${
          filteredProducts.length > 1 ? "resultados" : "resultado"
        } para ${searchTerm}`
      : `nenhum resultado encontrado para ${searchTerm}`;
  }, [searchTerm, loading, error, filteredProducts.length]);

  return (
    <div className="mb-[30px] pt-40 lg:pt-4 xl:pt-0">
      <div className="container mx-auto">
        <div className="flex gap-x-[30px]">
          <CategoryNav />
          <div>
            <div className="py-3 text-xl uppercase text-center lg:text-left">
              {titleText}
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:gap-[30px]">
              {filteredProducts.map((p) => {
                const adapted = {
                  id: p.id,
                  title: p.name ?? "",
                  description: p.details ?? "",
                  price: p.price ?? 0,
                  image_url: p.files?.[0]?.url ?? "",
                  category: p.category ?? "",
                  created_at: (p as any).created_at,
                };

                return <Product product={adapted as any} key={p.id} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
