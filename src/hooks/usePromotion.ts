import { useState, useEffect, useContext } from 'react';
import { usePromotions } from './useFetch';
import { CartContext } from '../contexts/CartContext';
import { promotionMatchesProductCategory } from '../utils/categoryMapping';

interface PromotionDiscount {
  hasDiscount: boolean;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  promotionTitle: string;
  savings: number;
}

export const usePromotion = (productId: string, originalPrice: number, productCategory?: string): PromotionDiscount => {
  const { promotions } = usePromotions();
  useContext(CartContext);

  const [discount, setDiscount] = useState<PromotionDiscount>({
    hasDiscount: false,
    originalPrice,
    discountedPrice: originalPrice,
    discountPercentage: 0,
    promotionTitle: '',
    savings: 0
  });

  useEffect(() => {
    if (!promotions || !productId) {
      setDiscount({
        hasDiscount: false,
        originalPrice,
        discountedPrice: originalPrice,
        discountPercentage: 0,
        promotionTitle: '',
        savings: 0
      });
      return;
    }

    const activePromotion = promotions
      .filter(promo => {
        const isActive = promo.active;
        const matchesSingleProduct = promo.promotion_type === 'single_product' && promo.product_id === productId && promo.discount_percent > 0;
        const matchesCategory = promo.promotion_type === 'category' && promo.target_category && promotionMatchesProductCategory(promo.target_category, productCategory) && promo.discount_percent > 0;
        // Buy X Get Y é removido da aplicação individual - apenas carrinho
        const matchesCombo = promo.promotion_type === 'combo' && promo.combo_products?.includes(productId) && promo.discount_percent > 0;
        const matchesConditional = promo.promotion_type === 'conditional' && promo.discount_percent > 0;
        
        // console.log('🔍 Verificando promoção:', {
        //   promoId: promo.id,
        //   promoType: promo.promotion_type,
        //   promoTarget: promo.target_category,
        //   productCategory,
        //   isActive,
        //   matchesSingleProduct,
        //   matchesCategory,
        //   matchesCombo,
        //   matchesConditional
        // });
        
        return isActive && (
          matchesSingleProduct ||
          matchesCategory ||
          matchesCombo ||
          matchesConditional
        );
      })
      .sort((a, b) => {
        // Ordem de prioridade por tipo de promoção
        const priorityOrder: { [key: string]: number } = {
          'single_product': 1,    // Maior prioridade
          'combo': 2,
          'category': 3,
          'conditional': 4        // Menor prioridade
        };
        
        const priorityA = priorityOrder[a.promotion_type as string] || 999;
        const priorityB = priorityOrder[b.promotion_type as string] || 999;
        
        // Se mesmo tipo, priorizar maior desconto
        if (priorityA === priorityB) {
          return b.discount_percent - a.discount_percent;
        }
        
        return priorityA - priorityB;
      })[0]; // Pegar o primeiro (maior prioridade)

    if (activePromotion) {
      const discountPercentage = activePromotion.discount_percent;
      const discountAmount = (originalPrice * discountPercentage) / 100;
      const discountedPrice = originalPrice - discountAmount;

      setDiscount({
        hasDiscount: true,
        originalPrice,
        discountedPrice,
        discountPercentage,
        promotionTitle: activePromotion.title || 'Promoção especial',
        savings: discountAmount
      });
    } else {
      setDiscount({
        hasDiscount: false,
        originalPrice,
        discountedPrice: originalPrice,
        discountPercentage: 0,
        promotionTitle: '',
        savings: 0
      });
    }
  }, [promotions, productId, originalPrice, productCategory]);

  return discount;
};