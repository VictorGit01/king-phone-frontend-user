import { ProductSlider } from "../../components/ProductSlider";

import { products } from "../../services/products";

export const Home = () => {
  return (
    <div className="mb-16">
      <div className="container mx-auto">
        <h2 className="h2 mb-6 text-center xl:text-left">Últimos Produtos</h2>
      </div>
      <ProductSlider data={products} />
    </div>
  );
};
