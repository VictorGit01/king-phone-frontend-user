import { createContext } from "react";

interface ValueContextType {
  formattedPrice: (price: number) => string;
}

export const ValueContext = createContext<ValueContextType>({
  formattedPrice: () => "",
});

export const ValueProvider = ({ children }: any) => {
  const formattedPrice = (price: number) => {
    const updatedPrice = `R$ ${price.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    return updatedPrice;
  };

  return (
    <ValueContext.Provider value={{ formattedPrice }}>
      {children}
    </ValueContext.Provider>
  );
};
