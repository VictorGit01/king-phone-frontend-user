import { useEffect, useState } from "react";

import { Hero } from "../../components/Hero";
import { LatestProducts } from "../../components/LatestProducts";
import { PopUpModal } from "../../components/PopUpModal";

const ORDER_PLACED_FLAG_KEY = "kingphone:orderPlaced";

export const Home = () => {
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);

  useEffect(() => {
    const hasFlag = sessionStorage.getItem(ORDER_PLACED_FLAG_KEY) === "1";
    if (!hasFlag) return;
    sessionStorage.removeItem(ORDER_PLACED_FLAG_KEY);
  // Garante que ao voltar para Home a pgina comece no topo
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setIsOrderSuccessModalOpen(true);
  }, []);

  return (
    <section>
      {isOrderSuccessModalOpen && (
        <PopUpModal
          openModal={isOrderSuccessModalOpen}
          setOpenModal={setIsOrderSuccessModalOpen}
          handleConfirm={() => setIsOrderSuccessModalOpen(false)}
          title="Pedido enviado! Agora é só aguardar nosso atendimento no WhatsApp."
          confirmText="Ok"
          cancelText=""
          variant="success"
        />
      )}
      <Hero />
      <LatestProducts />
    </section>
  );
};
