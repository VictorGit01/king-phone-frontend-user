import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { RelatedProducts } from "../../components/RelatedProducts";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";

import { products } from "../../services/products";

interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  category_id: string;
  is_new: boolean;
}

export const ProductDetails = () => {
  const { addToCart } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);
  const [product, setProduct] = useState<IProduct | null>();

  const { id } = useParams();

  // let formattedPrice = `R$ ${product?.price.toLocaleString("pt-br", {
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // })}`;

  useEffect(() => {
    setProduct(null);

    const productFound = products.find((product) => product.id === id);

    setTimeout(() => {
      setProduct(productFound);
    }, 3000);
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen min-w-screen justify-center items-center">
        <p className="h2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mb-16 pt-44 lg:pt-[30px] xl:pt-0">
      <div className="container mx-auto">
        {/* text */}
        <div className="flex flex-col lg:flex-row gap-[30px] mb-[30px]">
          <div className="flex-1 lg:max-w-[40%] lg:h-[540px] grad rounded-lg flex justify-center items-center">
            <img
              src={product?.image_url}
              className="w-full max-w-[65%]"
              alt={product.title}
            />
          </div>
          <div className="flex-1 bg-primary p-12 xl:p-20 rounded-lg flex flex-col justify-center">
            {/* category title */}
            <div className="uppercase text-accent text-lg font-medium mb-2">
              {product.category}
            </div>
            {/* title */}
            <h2 className="h2 mb-4">{product.title}</h2>
            {/* description */}
            <p className="mb-12">{product.description}</p>
            {/* price & button */}
            {/* <div className="flex items-center gap-x-8"> */}
            <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-x-8">
              {/* price */}
              <p className="text-2xl text-accent font-semibold text-nowrap mb-5 md:mb-0">
                {formattedPrice(product.price)}
              </p>
              <button
                onClick={() => addToCart(product, String(id))}
                className="button button-accent"
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
        <RelatedProducts category={product.category} />
      </div>
    </div>
  );
};
