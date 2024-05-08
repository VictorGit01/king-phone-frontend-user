import { ProductSlider } from "../ProductSlider";

import { products } from "../../services/products";

interface IRelatedProducts {
  category: string;
}

export const RelatedProducts = ({ category }: IRelatedProducts) => {
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <div className="mb-16">
      <div className="container mx-auto">
        <h2 className="h2 mb-6 text-center xl:text-left">
          Produtos Relacionados
        </h2>
        <ProductSlider data={filteredProducts} />
      </div>
    </div>
  );
};
