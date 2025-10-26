import { FC, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash } from "react-icons/fi";

import { Amount } from "../Amount";
import { PopUpModal } from "../PopUpModal";
import { usePromotion } from "../../hooks/usePromotion";
import { useCartPromotion } from "../../hooks/useCartPromotion";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";

interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  category_id: string;
  is_new: boolean;
  amount?: number;
}

export const CartItem: FC<{ product: IProduct }> = ({ product }) => {
  const { removeFromCart, cart } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);

  // Hook de promoção para o produto
  const promotion = usePromotion(product.id, product.price, product.category);

  // Transformar cart para useCartPromotion
  const cartItems = cart.map(item => ({
    id: item.id,
    category: item.category,
    price: item.price,
    quantity: item.amount || 1
  }));

  // Verificar se há promoção de carrinho ativa
  const { promotionApplied } = useCartPromotion(cartItems);

  // ✅ Lógica inteligente de supressão - igual ao CartContext
  const shouldSuppressInCart = promotionApplied && Number(product.amount) >= 2;
  const useIndividualDiscount = promotion.hasDiscount && !shouldSuppressInCart;

  // Debug logs para acompanhar a lógica visual
  console.log(`🎨 CartItem Visual - ${product.title}:`, {
    promotionApplied,
    quantity: Number(product.amount),
    shouldSuppressInCart,
    hasPromotion: promotion.hasDiscount,
    useIndividualDiscount,
    originalPrice: product.price,
    discountedPrice: promotion.discountedPrice
  });

  // Preço final por unidade
  const unitPrice = useIndividualDiscount ? promotion.discountedPrice : product.price;
  const updatedPrice = unitPrice * Number(product.amount);

  const handleRemoveProduct = () => {
    removeFromCart(product.id);
    setIsOpenPopUp(false);
  };

  return (
    <div className="flex gap-x-8">
      <Link to={`product/${product.id}`} className="w-[70px] h-[70px]">
        <img
          src={product.image_url}
          alt={product.title}
          className="min-w-5 object-cover"
        />
      </Link>
      <div className="flex-1">
        {/* title & remove icon */}
        <div className="flex gap-x-4 mb-3">
          <Link to={`product/${product.id}`} className="flex-1">
            {product.title}
          </Link>
          <div
            onClick={() => setIsOpenPopUp(true)}
            className="cursor-pointer text-[24px] hover:text-accent transition-all"
          >
            <FiTrash />
          </div>
        </div>
        <div className="flex items-center gap-x-12">
          {/* quantity */}
          <div className="flex gap-x-4 mb-2">
            <Amount product={product} setIsOpenPopUp={setIsOpenPopUp} />
          </div>
          <div className="text-accent text-xl">
            {formattedPrice(updatedPrice)}
          </div>
        </div>
        {/* price */}
        <div>
          {useIndividualDiscount ? (
            <>
              <span className="text-accent font-semibold">
                {formattedPrice(promotion.discountedPrice)} por unidade
              </span>
              <span className="text-gray-400 line-through ml-2">
                {formattedPrice(promotion.originalPrice)}
              </span>
            </>
          ) : (
            <span className="text-accent">
              {formattedPrice(product.price)} por unidade
            </span>
          )}
        </div>
      </div>
      {isOpenPopUp && (
        <PopUpModal
          openModal={isOpenPopUp}
          setOpenModal={setIsOpenPopUp}
          handleRemoveProduct={handleRemoveProduct}
        />
      )}
    </div>
  );
};
