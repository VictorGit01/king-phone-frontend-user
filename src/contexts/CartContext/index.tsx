import React, { createContext, useEffect, useState } from "react";

interface CartContextType {
  isOpen: boolean;
  productsAmount: number;
  total: number;
  cart: Array<IProduct>;

  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCart: React.Dispatch<React.SetStateAction<Array<IProduct>>>;
  // amount?: number;
  setProductsAmount: React.Dispatch<React.SetStateAction<number>>;

  addToCart: (product: IProduct, id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

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

export const CartContext = createContext<CartContextType>({
  isOpen: false,
  productsAmount: 0,
  total: 0,
  cart: [],

  setIsOpen: () => {},
  setCart: () => [],
  setProductsAmount: () => 0,
  // amount: 0,

  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => [],
});

export const CartProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Array<IProduct>>([]);
  const [productsAmount, setProductsAmount] = useState(0);
  // const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const amount = cart.reduce((a, c) => {
      return a + Number(c.amount);
    }, 0);

    setProductsAmount(amount);
  }, [cart]);

  useEffect(() => {
    const total = cart.reduce((a, c) => {
      return a + Number(c.price) * Number(c.amount);
    }, 0);

    setTotal(total);
  }, [cart]);

  const addToCart = (product: IProduct, id: string) => {
    const updatedProduct = { ...product, amount: 1 };

    const productAlreadyInserted = cart.find((product) => product.id === id);

    if (productAlreadyInserted) {
      const updatedCart = cart.map((product) => {
        if (product.id === id) {
          // setAmount(Number(product.amount) + 1);

          return { ...product, amount: Number(product.amount) + 1 };
        }
        return product;
      });

      setCart(updatedCart);
      setIsOpen(true);
      // updateProductsAmount(updatedCart);

      return;
    }

    setCart([...cart, updatedProduct]);
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((product) => product.id !== id);

    setCart(updatedCart);
    // updateProductsAmount(updatedCart);

    const amount = updatedCart.reduce((a, c) => {
      return a + Number(c.amount);
    }, 0);

    if (amount === 0) {
      setIsOpen(false);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        isOpen,
        setIsOpen,
        productsAmount,
        setProductsAmount,
        total,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
