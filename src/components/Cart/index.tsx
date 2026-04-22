import { useContext, useState } from "react";
import { FiX } from "react-icons/fi";
import { IoArrowForward, IoCartOutline } from "react-icons/io5";

import { CartItem } from "../CartItem";
import { BuildPopUp } from "../BuildPopUp";
import { PopUpModal } from "../PopUpModal";
import { CartAddressStep } from "../CartAddressStep";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";
import { usePromotions } from "../../hooks/useFetch";
import { calculateIndividualDiscount } from "../../utils/calculateIndividualDiscount";

interface CartContextType {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Cart = ({ setIsOpen }: CartContextType) => {
  const { cart, total, originalTotal, discount, appliedPromotion, clearCart } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);
  const { promotions } = usePromotions();

  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [isOpenClearCartModal, setIsOpenClearCartModal] = useState(false);
  const [step, setStep] = useState<"items" | "address">("items");

  const handleOrderPlaced = () => {
    setStep("items");
    setIsOpen(false);
  };

  const handleClearCartConfirm = () => {
    clearCart();
    setIsOpenClearCartModal(false);
  setStep("items");
  };

  // Create professional WhatsApp message (evitar emojis: alguns aparelhos mostram "?" em losango)
  const headerMessage = `*PEDIDO*\nOlá! Gostaria de fazer o seguinte pedido:\n\n`;

  const productList = cart
    .map((product) => {
      const qty = Number(product.amount) || 1;

      // ✅ Mesma regra do CartContext/CartItem: se há promoção de carrinho e qty>=2, suprime desconto individual
      const shouldSuppressIndividualDiscount = Boolean(appliedPromotion) && qty >= 2;

      const { hasDiscount, discountedPrice } = calculateIndividualDiscount(
        promotions,
        product.id,
        product.price,
        product.category
      );

      const unitPriceForWhatsapp = hasDiscount && !shouldSuppressIndividualDiscount ? discountedPrice : product.price;
      const itemSubtotalForWhatsapp = unitPriceForWhatsapp * qty;

      // Campos opcionais de produto (nem sempre vêm no tipo do carrinho)
      const brand = (product as any)?.brand;
      const color = (product as any)?.color;

      const extraInfoLines = [
        brand ? `- Marca: ${String(brand).trim()}` : "",
        color ? `- Cor: ${String(color).trim()}` : "",
      ].filter(Boolean);

  return `*${product.title}*\n` +
     (extraInfoLines.length ? `${extraInfoLines.join("\n")}\n` : "") +
     `- Preço un.: ${formattedPrice(unitPriceForWhatsapp)}\n` +
     `- Subtotal: ${formattedPrice(itemSubtotalForWhatsapp)}\n` +
     `- Foto: ${product.image_url}`;
    })
    .join("\n\n");

  // Include promotion information in WhatsApp message if applicable
  const promotionInfo = appliedPromotion && discount > 0 
    ? `\n\n*PROMOÇÃO APLICADA:* ${appliedPromotion}\n*DESCONTO:* ${formattedPrice(discount)}\n`
    : '';

  const footerMessage = `${promotionInfo}\n*TOTAL DO PEDIDO:* ${formattedPrice(total)}`;

  const message = `${headerMessage}${productList}${footerMessage}`;

  // WhatsApp phone must be provided via env var in production. If missing, build the URL without a phone
  // so developers notice the issue instead of shipping a test number in the code.
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  // const handleSendOrder = () => {
  //   console.log("PEDIDO:");
  //   console.log(cart);

  //   setIsOpenPopUp(true);
  // };

  return (
    <div className="relative w-full h-full px-4 text-white flex flex-col">
      {step === "address" ? (
        <CartAddressStep
          onBack={() => setStep("items")}
          whatsappUrl={whatsappUrl}
          onOrderPlaced={handleOrderPlaced}
        />
      ) : (
        <>
      {/* <div className="overflow-y-auto overflow-x-hidden h-[68vh]"> */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow pb-10 no-scrollbar">
        {/* close icon */}
        <div
          onClick={() => {
            setIsOpen(false);
            setStep("items");
          }}
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
                onClick={() => setIsOpenClearCartModal(true)}
                className="button button-accent hover:bg-accent-hover text-primary"
              >
                Limpar Carrinho
              </button>
              <button
                type="button"
                onClick={() => setStep("address")}
                className="button button-accent hover:bg-accent-hover text-primary flex-1 px-2 gap-x-2 flex items-center justify-center"
                title="Avançar para endereço"
              >
                Avançar
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

      {isOpenClearCartModal && (
        <PopUpModal
          openModal={isOpenClearCartModal}
          setOpenModal={setIsOpenClearCartModal}
          handleConfirm={handleClearCartConfirm}
          title="Tem certeza de que deseja excluir todos os produtos do carrinho?"
          confirmText="Sim, limpar carrinho"
          cancelText="Não, manter produtos"
        />
      )}
        </>
      )}
    </div>
  );
};
