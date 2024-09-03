import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { RiVipCrownLine } from "react-icons/ri";

export const Footer = () => {
  return (
    <footer className="pt-16 bg-primary">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="h2 uppercase mb-6 font-semibold">
            Assine a nossa newsletter.
          </h2>
          <p className="text-white/70">
            Seja o primeiro a receber as últimas novidades sobre tendências,
            promoções e muito mais!
          </p>
        </div>
        {/* form */}
        <form className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-5 my-14">
          <input
            type="text"
            placeholder="Seu endereço de email"
            className="input"
          />
          {/* <button className="button button-accent min-w-[150px]"> */}
          <button className="button button-accent min-w-[150px] whitespace-nowrap">
            Inscrever-se
          </button>
        </form>
        {/* links */}
        <div className="text-base text-white/60 flex gap-x-6 capitalize max-w-max mx-auto mb-9">
          <a href="#" className="hover:text-white transition-all">
            Política de devolução
          </a>
          <a href="#" className="hover:text-white transition-all">
            Acompanhe seu pedido
          </a>
          <a href="#" className="hover:text-white transition-all">
            Envio e entrega
          </a>
        </div>
        {/* socials */}
        <div className="flex gap-x-6 max-w-max mx-auto text-lg mb-16">
          <a
            className="hover:text-white transition-all"
            target="_blank"
            href="https://api.whatsapp.com/send/?phone=5561992854599&text&type=phone_number&app_absent=0"
          >
            <FaWhatsapp />
          </a>
          <a
            className="hover:text-white transition-all"
            href="https://www.instagram.com/kingphone._/"
            target="_blank"
          >
            <FaInstagram />
          </a>
          <a
            className="hover:text-white transition-all"
            href="https://www.google.com/maps/dir/-16.0734057,-47.9713124/Kingphone+-+Av.+Sen.+Tancredo+Neves+-+Valpara%C3%ADso,+1+-+Etapa+E,+Quadra+11+-+Valparaizo+I,+Valpara%C3%ADso+de+Goi%C3%A1s+-+GO/@-16.0787109,-47.9864435,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0"
            target="_blank"
          >
            <IoLocationOutline />
          </a>
          <a
            className="hover:text-white transition-all"
            href="https://chat.whatsapp.com/HlyNaZ3gQXm9kSF40NlNA2"
            target="_blank"
          >
            <RiVipCrownLine />
          </a>
        </div>
      </div>
      {/* copyright */}
      <div className="py-10 border-t border-t-white/10">
        <div className="container mx-auto">
          <div className="text-center text-sm text-white/60">
            Copyright &copy; Kingphone {new Date().getFullYear()}. Todos os
            direitos reservados
          </div>
        </div>
      </div>
    </footer>
  );
};
