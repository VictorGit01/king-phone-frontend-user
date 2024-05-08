import { useLocation } from "react-router-dom";

import { CategoryNav } from "../../components/CategoryNav";
import { Product } from "../../components/Product";
import { products } from "../../services/products";

interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_new: boolean;
}

export const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query");
  console.log(searchTerm);

  const data = products.filter((product) => {
    const titleLowerCase = product.title.toLowerCase();
    const searchTermLowerCase = searchTerm?.toLowerCase() as string;

    return titleLowerCase.includes(searchTermLowerCase);
  });
  console.log(data);
  return (
    <div className="mb-[30px] pt-40 lg:pt-4 xl:pt-0">
      <div className="container mx-auto">
        <div className="flex gap-x-[30px]">
          {/* product grid */}
          <CategoryNav />
          <div>
            {/* title */}
            <div className="py-3 text-xl uppercase text-center lg:text-left">
              {data.length > 0
                ? `${data.length} ${
                    data.length > 1 ? "resultados" : "resultado"
                  } para ${searchTerm}`
                : `nenhum resultado encontrado para ${searchTerm}`}
            </div>
            {/* products grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:gap-[30px]">
              {data?.map((product) => (
                <Product product={product} key={product.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
