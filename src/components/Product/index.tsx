import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_new: boolean;
}

export const Product = ({ product }: { product: Product }) => {
  let formattedPrice = product.price.toLocaleString("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Link to={`/product/${product.id}`}>
      <div className="grad w-full h-[362px] rounded-[8px] overflow-hidden relative group">
        {product.is_new && (
          <div className="absolute bg-accent text-primary text-[12px] font-extrabold uppercase top-4 right-4 px-2 rounded-full z-10">
            novo
          </div>
        )}

        <div className="w-full h-[200px] flex items-center justify-center relative">
          <img
            className="max-w-[160px] max-h-[160px] group-hover:scale-90 transition-all"
            // src={`http://localhost:5173${product.image_url}`}
            src={product.image_url}
            alt=""
          />
        </div>

        <div className="px-6 pb-8 flex flex-col">
          <div className="text-sm text-accent capitalize mb-2">
            {product.category}
          </div>

          <div className="text-[15px] mb-4 lg:mb-9">
            {product.title.substring(0, 35)}...
          </div>

          <div className="text-lg text-accent">R$ {formattedPrice}</div>
        </div>
      </div>
    </Link>
  );
};
