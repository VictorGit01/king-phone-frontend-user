import { ProductSlider } from "../../components/ProductSlider";

import { products } from "../../services/products";

export const LatestProducts = () => {
  return (
    <div className="mb-16 flex-col items-center px-[1rem]">
      <div className="container mx-auto">
        <h2 className="h2 mb-6 text-center xl:text-left">Últimos Produtos</h2>
      </div>
      <ProductSlider data={products} latestProducts={true} />
    </div>
  );
};
