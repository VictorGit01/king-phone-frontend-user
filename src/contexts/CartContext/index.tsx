import React, { createContext, useEffect, useState, useMemo } from "react";
import { useCartPromotion } from "../../hooks/useCartPromotion";
import { usePromotions } from "../../hooks/useFetch";
import { calculateIndividualDiscount } from "../../utils/calculateIndividualDiscount.ts";
import { loadFromStorage, removeFromStorage, saveToStorage } from "../../utils/storage";
import { logger } from "../../utils/logger";

const CART_STORAGE_KEY = "kingphone:cart:v1";

interface CartContextType {
  isOpen: boolean;
  productsAmount: number;
  total: number;
  cart: Array<IProduct>;
  
  // Promotion-related fields
  originalTotal: number;
  discount: number;
  appliedPromotion: string | null;

  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCart: React.Dispatch<React.SetStateAction<Array<IProduct>>>;
  // amount?: number;
  setProductsAmount: React.Dispatch<React.SetStateAction<number>>;

  addToCart: (product: IProduct, id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
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
  brand?: string;
  color?: string;
  amount?: number;
}

export const CartContext = createContext<CartContextType>({
  isOpen: false,
  productsAmount: 0,
  total: 0,
  cart: [],
  
  // Promotion-related default values
  originalTotal: 0,
  discount: 0,
  appliedPromotion: null,

  setIsOpen: () => {},
  setCart: () => [],
  setProductsAmount: () => 0,
  // amount: 0,

  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => [],
  placeOrder: () => {},
});

export const CartProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Array<IProduct>>(() => loadFromStorage<Array<IProduct>>(CART_STORAGE_KEY) ?? []);
  const [productsAmount, setProductsAmount] = useState(0);
  // const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);

  // Buscar promoções disponíveis
  const { promotions } = usePromotions();

  // Transform cart items to match CartItem interface for useCartPromotion
  const cartItems = useMemo(() => cart.map(item => ({
    id: item.id,
    category: item.category,
    price: item.price,
    quantity: item.amount || 1
  })), [cart]);

  // Use cart promotion hook
  const { promotionApplied, discountedTotal, savings, promotionTitle } = useCartPromotion(cartItems);

  // desconto individual foi movido para util compartilhado

  useEffect(() => {
    const amount = cart.reduce((a, c) => {
      return a + Number(c.amount);
    }, 0);

    setProductsAmount(amount);
  }, [cart]);

  // Persistência do carrinho
  useEffect(() => {
    if (cart.length === 0) {
      removeFromStorage(CART_STORAGE_KEY);
      return;
    }
    saveToStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    // Calcular o total considerando descontos individuais quando não há promoção de carrinho
  const calculateTotal = () => {
      return cart.reduce((total, item) => {
        const currentQuantity = item.amount || 1;
        // ✅ Nova lógica inteligente de supressão
        // Suprimir desconto individual APENAS se há promoção de carrinho E ela afeta este produto
        const shouldSuppress = promotionApplied && currentQuantity >= 2;
        
        // Se não há promoção de carrinho OU não deve suprimir, aplicar desconto individual
        if (!shouldSuppress) {
          const { hasDiscount, discountedPrice } = calculateIndividualDiscount(promotions, item.id, item.price, item.category);
          
          if (hasDiscount) {
            logger.debug(`🎯 Aplicando desconto individual para ${item.title || item.id}: R$ ${item.price} → R$ ${discountedPrice} (Qty: ${currentQuantity})`);
            return total + (discountedPrice * currentQuantity);
          }
        } else {
          logger.debug(`⚠️ Suprimindo desconto individual para ${item.title || item.id} - Promoção de carrinho ativa (Qty: ${currentQuantity})`);
        }
        
        // Caso padrão: usar preço original
        return total + (item.price * currentQuantity);
      }, 0);
    };

    const calculatedTotal = calculateTotal();
    setOriginalTotal(calculatedTotal);
    
    // 🔧 CORREÇÃO: Quando há promoção de carrinho, precisamos calcular o total final
    // considerando tanto o desconto da promoção quanto os descontos individuais não suprimidos
    if (promotionApplied) {
      // Calcular total com descontos individuais aplicados
      const totalWithIndividualDiscounts = calculateTotal();
      // Aplicar o desconto da promoção de carrinho sobre o subtotal original
      const originalSubtotal = cart.reduce((total, item) => total + (item.price * (item.amount || 1)), 0);
      const cartPromotionDiscount = originalSubtotal - discountedTotal;
      const finalTotal = totalWithIndividualDiscounts - cartPromotionDiscount;
      
  logger.debug('💰 Cálculo final do total:', {
        originalSubtotal,
        totalWithIndividualDiscounts,
        cartPromotionDiscount,
        finalTotal,
        discountedTotal
      });
      
      setTotal(finalTotal);
    } else {
      setTotal(calculatedTotal);
    }
  }, [cart, discountedTotal, promotionApplied, promotions]);

  const addToCart = (product: IProduct, id: string, quantity: number = 1) => {
    const updatedProduct = { ...product, amount: quantity };

    const productAlreadyInserted = cart.find((product) => product.id === id);

    if (productAlreadyInserted) {
      const updatedCart = cart.map((product) => {
        if (product.id === id) {
          return { ...product, amount: Number(product.amount) + quantity };
        }
        return product;
      });

      setCart(updatedCart);
      setIsOpen(true);

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
  setIsOpen(false);
  };

  const placeOrder = () => {
    // Ação única para pós-redirecionamento ao WhatsApp
    setCart([]);
    setIsOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        isOpen,
        setIsOpen,
        productsAmount,
        setProductsAmount,
        total,
        originalTotal,
        discount: savings,
        appliedPromotion: promotionApplied ? promotionTitle : null,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
  placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
