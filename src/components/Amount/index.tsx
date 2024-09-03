import { ChangeEventHandler, FC, useContext, useEffect, useState } from "react";

import { CartContext } from "../../contexts/CartContext";

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

  const [amount, setAmount] = useState(product.amount);

  useEffect(() => {
    cart.map((item) => {
      if (item.id === product.id) {
        setAmount(item.amount);
      }
    });
  }, [cart]);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value);
    const cartProduct = cart.find((item) => {
      return item.id === product.id;
    });

    if (value < 0 || isNaN(value)) {
      return;
    }

    if (value === 0) {
      return setIsOpenPopUp(true);
    }

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
    <div className="flex gap-x-6 items-center text-primary">
      {/* {Number(product.amount) > 10 ? (
        <select
          value={product.amount}
          className="p-2 rounded-lg w-[100px] h-12 outline-none text-primary"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10+</option>
        </select>
      ) : (
        <input
          className="text-primary placeholder:text-primary h-12 rounded-md p-4 w-[120px] outline-accent"
          type="text"
          // placeholder={`${product.amount}`}
        />
      )} */}
      <input
        className="text-primary placeholder:text-primary h-12 rounded-md p-4 w-[120px] outline-accent"
        type="number"
        value={amount}
        onChange={handleChangeInput}
        // placeholder={`${product.amount}`}
      />
    </div>
  );
};
