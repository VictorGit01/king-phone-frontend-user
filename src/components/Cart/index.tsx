import { useContext, useState } from "react";
import { FiX } from "react-icons/fi";
import { IoArrowForward, IoCartOutline } from "react-icons/io5";

import { CartItem } from "../CartItem";
import { BuildPopUp } from "../BuildPopUp";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";

interface CartContextType {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Cart = ({ setIsOpen }: CartContextType) => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);

  const [isOpenPopUp, setIsOpenPopUp] = useState(false);

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
              <div>{formattedPrice(total)}</div>
            </div>
            {/* total */}
            <div className="flex justify-between text-2xl">
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
              <button
                className="button button-accent hover:bg-accent-hover text-primary flex-1 px-2 gap-x-2"
                onClick={() => setIsOpenPopUp(true)}
              >
                Enviar Pedido
                <IoArrowForward className="text-lg" />
              </button>
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
