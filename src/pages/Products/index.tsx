import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CategoryNav } from "../../components/CategoryNav";
import { Product } from "../../components/Product";

import { products } from "../../services/products";

export const Products = () => {
  const [title, setTitle] = useState("");

  const { id } = useParams();
  // get products based on category id
  const filteredProducts = products.filter(
    (product) => product.category_id === id
  );

  useEffect(() => {
    if (filteredProducts) setTitle(String(filteredProducts[0]?.category));
  });

  return (
    <div className="mb-16 pt-40 lg:pt-0">
      <div className="container mx-auto">
        <div className="flex gap-x-[30px]">
          <CategoryNav />
          <main className="w-[100%]">
            {/* title */}
            <div className="py-3 text-xl uppercase text-center lg:text-left">
              {filteredProducts.length ? title : "Nenhum produto em estoque"}
            </div>
            {/* product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:gap-[30px]">
              {filteredProducts?.map((product) => (
                <Product product={product} key={product.id} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
