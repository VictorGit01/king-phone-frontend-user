import React, { createContext, useState } from "react";

interface CartContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CartContext = createContext<CartContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export const CartProvider: React.FC = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CartContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};
