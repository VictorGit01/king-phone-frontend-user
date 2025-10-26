import React, { createContext, useEffect, useState, useMemo } from "react";
import { useCartPromotion } from "../../hooks/useCartPromotion";
import { usePromotions } from "../../hooks/useFetch";

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
});

export const CartProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Array<IProduct>>([]);
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

  // Função para calcular desconto individual de um produto
  const calculateIndividualDiscount = (productId: string, originalPrice: number, productCategory?: string) => {
    if (!promotions || !productId) return { hasDiscount: false, discountedPrice: originalPrice };

    // Mapeamento de categorias para manter compatibilidade com promoções antigas
    const categoryMapping: { [key: string]: string[] } = {
      'Smartphones': ['Smartphones', 'smartphone'],
      'Fones de ouvido': ['Fones de ouvido', 'Fones de Ouvido', 'headphone'],
      'Dispositivos vestíveis': ['Dispositivos vestíveis', 'smartwatch'],
      'Carregadores': ['Carregadores', 'charger'],
      'Assistentes virtuais': ['Assistentes virtuais', 'assistant'],
      'Customização': ['Customização', 'customization'],
      'smartphone': ['Smartphones', 'smartphone'],
      'headphone': ['Fones de ouvido', 'Fones de Ouvido', 'headphone'],
      'accessory': ['Acessórios', 'accessory'],
      'speaker': ['Alto-falantes', 'speaker'],
      'smartwatch': ['Dispositivos vestíveis', 'Smartwatches', 'smartwatch'],
      'tablet': ['Tablets', 'tablet'],
      'gaming': ['Gaming', 'gaming'],
      'charger': ['Carregadores', 'charger'],
      'assistant': ['Assistentes virtuais', 'assistant'],
      'customization': ['Customização', 'customization']
    };

    // Função para verificar se uma categoria da promoção corresponde à categoria do produto
    const categoriesMatch = (promoCategory: string, productCategory: string | undefined) => {
      if (!productCategory || !promoCategory) return false;
      if (promoCategory === productCategory) return true;
      const mappedCategories = categoryMapping[promoCategory] || [];
      return mappedCategories.includes(productCategory);
    };

    // Buscar promoção ativa para este produto
    const activePromotion = promotions
      .filter(promo => {
        const isActive = promo.active;
        const matchesSingleProduct = promo.promotion_type === 'single_product' && promo.product_id === productId && promo.discount_percent > 0;
        const matchesCategory = promo.promotion_type === 'category' && promo.target_category && categoriesMatch(promo.target_category, productCategory) && promo.discount_percent > 0;
        const matchesCombo = promo.promotion_type === 'combo' && promo.combo_products?.includes(productId) && promo.discount_percent > 0;
        const matchesConditional = promo.promotion_type === 'conditional' && promo.discount_percent > 0;
        
        return isActive && (
          matchesSingleProduct ||
          matchesCategory ||
          matchesCombo ||
          matchesConditional
        );
      })
      .sort((a, b) => {
        const priorityOrder: { [key: string]: number } = {
          'single_product': 1,
          'combo': 2,
          'category': 3,
          'conditional': 4
        };
        
        const priorityA = priorityOrder[a.promotion_type as string] || 999;
        const priorityB = priorityOrder[b.promotion_type as string] || 999;
        
        if (priorityA === priorityB) {
          return b.discount_percent - a.discount_percent;
        }
        
        return priorityA - priorityB;
      })[0];

    if (activePromotion) {
      const discountPercentage = activePromotion.discount_percent;
      const discountAmount = (originalPrice * discountPercentage) / 100;
      const discountedPrice = originalPrice - discountAmount;

      return {
        hasDiscount: true,
        discountedPrice,
        promotionTitle: activePromotion.title || 'Promoção especial'
      };
    }

    return { hasDiscount: false, discountedPrice: originalPrice };
  };

  useEffect(() => {
    const amount = cart.reduce((a, c) => {
      return a + Number(c.amount);
    }, 0);

    setProductsAmount(amount);
  }, [cart]);

  useEffect(() => {
    // Calcular o total considerando descontos individuais quando não há promoção de carrinho
    const calculateTotal = (includeCartPromotions = false) => {
      return cart.reduce((total, item) => {
        const currentQuantity = item.amount || 1;
        // ✅ Nova lógica inteligente de supressão
        // Suprimir desconto individual APENAS se há promoção de carrinho E ela afeta este produto
        const shouldSuppress = promotionApplied && currentQuantity >= 2;
        
        // Se não há promoção de carrinho OU não deve suprimir, aplicar desconto individual
        if (!shouldSuppress) {
          const { hasDiscount, discountedPrice } = calculateIndividualDiscount(item.id, item.price, item.category);
          
          if (hasDiscount) {
            console.log(`🎯 Aplicando desconto individual para ${item.title || item.id}: R$ ${item.price} → R$ ${discountedPrice} (Qty: ${currentQuantity})`);
            return total + (discountedPrice * currentQuantity);
          }
        } else {
          console.log(`⚠️ Suprimindo desconto individual para ${item.title || item.id} - Promoção de carrinho ativa (Qty: ${currentQuantity})`);
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
      
      console.log('💰 Cálculo final do total:', {
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
