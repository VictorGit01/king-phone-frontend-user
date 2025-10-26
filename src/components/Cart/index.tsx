import { useContext, useState } from "react";
import { FiX } from "react-icons/fi";
import { IoArrowForward, IoCartOutline } from "react-icons/io5";

import { CartItem } from "../CartItem";
import { BuildPopUp } from "../BuildPopUp";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";
import { Link } from "react-router-dom";

interface CartContextType {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Cart = ({ setIsOpen }: CartContextType) => {
  const { cart, total, originalTotal, discount, appliedPromotion, clearCart } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);

  const [isOpenPopUp, setIsOpenPopUp] = useState(false);

  // Create professional WhatsApp message
  const headerMessage = `🛒 *Olá! Gostaria de fazer o seguinte pedido:*\n\n`;

  const productList = cart
    .map((product) => {
      const itemTotal = product.price * Number(product.amount);
      return `📱 *${product.title}*\n` +
             `   └ ${product.amount}x - ${formattedPrice(product.price)} cada\n` +
             `   └ Subtotal: ${formattedPrice(itemTotal)}\n` +
             `   └ 🖼️ Foto: ${product.image_url}`;
    })
    .join("\n\n");

  // Include promotion information in WhatsApp message if applicable
  const promotionInfo = appliedPromotion && discount > 0 
    ? `\n\n🎉 *Promoção Aplicada: ${appliedPromotion}*\n💰 Desconto: ${formattedPrice(discount)}\n`
    : '';

  const footerMessage = `${promotionInfo}\n💰 *Total do Pedido: ${formattedPrice(total)}*`;

  const message = `${headerMessage}${productList}${footerMessage}`;

  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+5594992424762";

  // const handleSendOrder = () => {
  //   console.log("PEDIDO:");
  //   console.log(cart);

  //   setIsOpenPopUp(true);
  // };

  return (
    <div className="relative w-full h-full px-4 text-white flex flex-col">
      {/* <div className="overflow-y-auto overflow-x-hidden h-[68vh]"> */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow pb-10 no-scrollbar">
        {/* close icon */}
        <div
          onClick={() => setIsOpen(false)}
          className="text-4xl w-20 h-[98px] flex justify-start items-center cursor-pointer"
        >
          <FiX className="text-3xl" />
        </div>
        <div className="flex flex-col gap-y-10 px-2">
          {cart.map((product) => (
            <CartItem product={product} key={product.id} />
          ))}
        </div>
      </div>
      <div className="w-full pb-5">
        {/* subtotal & total */}
        {cart.length >= 1 && (
          <div className="px-6 pb-7 pt-4 flex flex-col">
            {/* subtotal */}
            <div className="flex justify-between text-lg">
              <div>Subtotal</div>
              <div>{formattedPrice(originalTotal)}</div>
            </div>
            
            {/* promotion info */}
            {appliedPromotion && discount > 0 && (
              <>
                <div className="flex justify-between text-sm text-green-400 mt-1">
                  <div>🎉 {appliedPromotion}</div>
                  <div>-{formattedPrice(discount)}</div>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
              </>
            )}
            
            {/* total */}
            <div className="flex justify-between text-2xl font-bold">
              <div>Total</div>
              <div>{formattedPrice(total)}</div>
            </div>
          </div>
        )}
        {/* buttons */}
        <div className="px-6">
          {cart.length >= 1 ? (
            // <div className="flex justify-between gap-x-4">
            <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
              <button
                onClick={clearCart}
                className="button button-accent hover:bg-accent-hover text-primary"
              >
                Limpar Carrinho
              </button>
              <Link
                className="button button-accent hover:bg-accent-hover text-primary flex-1 px-2 gap-x-2 flex items-center justify-center"
                to={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                  message
                )}`}
                target="_blank"
                title="Enviar pedido via WhatsApp"
              >
                📱 Enviar via WhatsApp
                <IoArrowForward className="text-lg" />
              </Link>
            </div>
          ) : (
            <div className="h-full absolute top-0 right-0 left-0 flex justify-center items-center -z-10 flex-col text-white/30">
              <div className="text-2xl">Seu carrinho está vazio.</div>
              <div className="text-6xl">
                <IoCartOutline />
              </div>
            </div>
          )}
        </div>
      </div>
      <BuildPopUp isOpenPopUp={isOpenPopUp} setIsOpenPopUp={setIsOpenPopUp} />
    </div>
  );
};
