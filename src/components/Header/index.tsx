import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.svg";

import { SlBag } from "react-icons/sl";
import { FiGrid, FiMenu } from "react-icons/fi";

import { SearchForm } from "../SearchForm";
import { CategoryNavMobile } from "../CategoryNavMobile";
import { Cart } from "../Cart";
import { CartContext } from "../../contexts/CartContext";

export const Header = () => {
  const { isOpen, setIsOpen, productsAmount } = useContext(CartContext);
  const [catNavMobile, setCatNavMobile] = useState(false);
  const [navPopoverOpen, setNavPopoverOpen] = useState(false);
  const navPopoverRef = useRef<HTMLDivElement | null>(null);

  // Evita que a página atrás role quando o menu lateral estiver aberto (mobile/tablet)
  useEffect(() => {
    if (!catNavMobile) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [catNavMobile]);

  // Fecha o popover de navegação ao clicar fora
  useEffect(() => {
    if (!navPopoverOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = navPopoverRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setNavPopoverOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [navPopoverOpen]);

  return (
    // <header className="bg-primary py-4 fixed w-full top-0 z-40 lg:relative xl:mb-[30px]">
  <header className="bg-primary py-6 fixed w-full top-0 z-40 lg:relative xl:mb-[30px]">
      <div className="container mx-auto">
        <div className="flex flex-row gap-4 lg:items-center justify-between mb-4 lgxl:mb-0">
          {/* menu */}
          <div
            onClick={() => setCatNavMobile(true)}
            className="text-3xl lgxl:hidden cursor-pointer"
          >
            <FiMenu />
          </div>
          {/* category nav mobile */}
          <div
            className={`${
              catNavMobile ? "left-0" : "-left-full"
            } fixed top-0 bottom-0 z-30 w-full h-screen transition-all duration-200`}
          >
            <CategoryNavMobile setCatNavMobile={setCatNavMobile} />
          </div>
          {/* logo */}
          <Link to={"/"}>
            <img
              // className="h-10"
              className="h-7 md:h-8 lg:h-9 lgxl:h-9 xxl:h-10"
              src={logo}
              alt=""
            />
          </Link>
          {/* searchform - show only on desktop */}
          <div className="hidden w-full lgxl:flex lgxl:max-w-[600px]">
            <SearchForm />
          </div>
          {/* navigation & cart */}
          <div className="flex items-center gap-x-[10px]">
            {/* nav popover (1024–1359px) - à esquerda do carrinho */}
            <div className="relative hidden lgxl:block xl:hidden" ref={navPopoverRef}>
              <button
                type="button"
                onClick={() => setNavPopoverOpen((v) => !v)}
                className="p-0 leading-none hover:text-accent transition-colors flex items-center justify-center"
                aria-haspopup="menu"
                aria-expanded={navPopoverOpen}
                aria-label="Abrir menu"
              >
                <FiGrid className="w-6 h-6 block scale-[1.18] origin-center" />
              </button>

              {navPopoverOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 rounded-[12px] bg-[#0E0F10] shadow-xl border border-white/10 overflow-hidden z-50"
                  role="menu"
                >
                  <Link
                    to="/"
                    className="block px-4 py-3 uppercase text-sm hover:bg-white/10 transition-colors"
                    onClick={() => setNavPopoverOpen(false)}
                    role="menuitem"
                  >
                    Início
                  </Link>
                  <Link
                    to="/products"
                    className="block px-4 py-3 uppercase text-sm hover:bg-white/10 transition-colors"
                    onClick={() => setNavPopoverOpen(false)}
                    role="menuitem"
                  >
                    Produtos
                  </Link>
                  <Link
                    to="/promotions"
                    className="block px-4 py-3 uppercase text-sm hover:bg-white/10 transition-colors"
                    onClick={() => setNavPopoverOpen(false)}
                    role="menuitem"
                  >
                    Promoções
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-3 uppercase text-sm hover:bg-white/10 transition-colors"
                    onClick={() => setNavPopoverOpen(false)}
                    role="menuitem"
                  >
                    Contato
                  </Link>
                </div>
              )}
            </div>

            {/* navigation menu */}
            <nav className="hidden xl:flex items-center gap-x-6 uppercase text-sm font-medium mr-8">
              <Link to="/" className="hover:text-accent transition-colors">
                Início
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/products" className="hover:text-accent transition-colors">
                Produtos
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/promotions" className="hover:text-accent transition-colors">
                Promoções
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/contact" className="hover:text-accent transition-colors">
                Contato
              </Link>
            </nav>
            {/* cart icon */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="relative cursor-pointer flex items-center"
            >
              <SlBag className="w-6 h-6 block" />
              {/* amount */}
              <div className="bg-accent text-primary absolute w-[18px] h-[18px] rounded-full top-3 -right-1 text-[13px] flex justify-center items-center font-bold tracking-[-0.1em]">
                {productsAmount}
              </div>
            </div>
            {/* cart */}
            <div
              className={`
            ${isOpen ? "right-0" : "-right-full"}
            bg-[#0E0F10] shadow-xl fixed top-0 bottom-0 w-full z-10 md:max-w-[500px] transition-all duration-300`}
            >
              <Cart setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>
        {/* searchform - show on mobile only */}
  <div className="lgxl:hidden">
          <SearchForm />
        </div>
      </div>
    </header>
  );
};
