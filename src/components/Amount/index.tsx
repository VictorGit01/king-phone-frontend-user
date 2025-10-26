import { FC, useContext, useEffect, useState } from "react";

import { CartContext } from "../../contexts/CartContext";
import { useProducts } from "../../hooks/useFetch";

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

export const Amount: FC<{ product: IProduct; setIsOpenPopUp: any }> = ({
  product,
  setIsOpenPopUp,
}) => {
  const { cart, setCart, setProductsAmount } = useContext(CartContext);
  const { data: products } = useProducts();

  const [amount, setAmount] = useState(product.amount);

  // Get current product stock from API
  const currentProductStock = products?.find(p => p.id === product.id)?.quantity || 0;

  useEffect(() => {
    cart.map((item) => {
      if (item.id === product.id) {
        setAmount(item.amount);
      }
    });
  }, [cart]);

  const incrementAmount = () => {
    const newValue = Number(amount) + 1;
    if (newValue > currentProductStock) {
      alert(`Só temos ${currentProductStock} unidades disponíveis em estoque`);
      return;
    }
    updateCartAmount(newValue);
  };

  const decrementAmount = () => {
    const newValue = Number(amount) - 1;
    if (newValue === 0) {
      return setIsOpenPopUp(true);
    }
    if (newValue >= 1) {
      updateCartAmount(newValue);
    }
  };

  const updateCartAmount = (value: number) => {
    const cartProduct = cart.find((item) => item.id === product.id);
    
    if (cartProduct) {
      const updatedCart = cart.map((item) => {
        if (item.id === product.id) {
          setProductsAmount(value);
          return { ...item, amount: value };
        }
        return item;
      });
      setCart(updatedCart);
    }
    setAmount(value);
  };

  return (
    <div className="flex gap-x-2 items-center text-white">
      <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden bg-white">
        <button
          onClick={decrementAmount}
          disabled={Number(amount) <= 1}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors text-white"
        >
          -
        </button>
        <span className="px-4 py-2 bg-gray-800 text-white min-w-[50px] text-center border-x border-gray-600">
          {amount}
        </span>
        <button
          onClick={incrementAmount}
          disabled={Number(amount) >= currentProductStock}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors text-white"
        >
          +
        </button>
      </div>
      <span className="text-xs text-gray-400">
        Máx: {currentProductStock}
      </span>
    </div>
  );
};
