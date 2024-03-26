import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.svg";

import { SlBag } from "react-icons/sl";
import { FiMenu } from "react-icons/fi";

import { SearchForm } from "../SearchForm";
import { CategoryNavMobile } from "../CategoryNavMobile";
import { Cart } from "../Cart";
import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";

interface CartContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header = () => {
  const { isOpen, setIsOpen } = useContext<CartContextType>(CartContext);
  const [catNavMobile, setCatNavMobile] = useState(false);

  return (
    // <header className="bg-primary py-4 fixed w-full top-0 z-40 lg:relative xl:mb-[30px]">
    <header className="bg-primary py-6 fixed w-full top-0 z-40 lg:relative xl:mb-[30px]">
      <div className="container mx-auto">
        <div className="flex flex-row gap-4 lg:items-center justify-between mb-4 xl:mb-0">
          {/* menu */}
          <div
            onClick={() => setCatNavMobile(true)}
            className="text-3xl xl:hidden cursor-pointer"
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
              className="h-[1.6rem] md:h-7 xl:h-7 lg:h-7 xxl:h-8"
              src={logo}
              alt=""
            />
          </Link>
          {/* searchform - show only on desktop */}
          <div className="hidden w-full xl:flex xl:max-w-[734px]">
            <SearchForm />
          </div>
          {/* phone & cart */}
          <div className="flex items-center gap-x-[10px]">
            {/* phone */}
            <div className="hidden xl:flex uppercase">
              Precisa de ajuda? +55 61 99285-4599
            </div>
            {/* cart icon */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="relative cursor-pointer"
            >
              <SlBag className="text-2l" />
              {/* amount */}
              <div className="bg-accent text-primary absolute w-[18px] h-[18px] rounded-full top-3 -right-1 text-[13px] flex justify-center items-center font-bold tracking-[-0.1em]">
                2
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
        <div className="xl:hidden">
          <SearchForm />
        </div>
      </div>
    </header>
  );
};
