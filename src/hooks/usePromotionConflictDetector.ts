import { useMemo } from 'react';
import { usePromotions } from './useFetch';
import { logger } from '../utils/logger';

interface CartItem {
  id: string;
  category: string;
  price: number;
  quantity: number;
}

interface PromotionConflictResult {
  shouldApplyIndividualPromotion: boolean;
  bestPromotionType: 'individual' | 'quantity' | 'none';
  conflictingPromotions: string[];
  reasoning: string;
}

/**
 * Hook que detecta conflitos entre promoções individuais e de quantidade/carrinho
 * e determina qual deve ser aplicada para beneficiar mais o cliente
 */
export const usePromotionConflictDetector = (
  productId: string,
  productCategory: string,
  cartItems: CartItem[]
): PromotionConflictResult => {
  const { promotions } = usePromotions();

  const result = useMemo(() => {
    if (!promotions || !productId) {
      return {
        shouldApplyIndividualPromotion: true,
        bestPromotionType: 'none' as const,
        conflictingPromotions: [],
        reasoning: 'Sem promoções disponíveis'
      };
    }

    // Mapeamento de categorias
    const categoryMapping: { [key: string]: string[] } = {
      'Smartphones': ['Smartphones', 'smartphone'],
      'Fones de ouvido': ['Fones de ouvido', 'Fones de Ouvido', 'headphone'],
      'Dispositivos vestíveis': ['Dispositivos vestíveis', 'smartwatch'],
      'Carregadores': ['Carregadores', 'charger'],
      'Assistentes virtuais': ['Assistentes virtuais', 'assistant'],
      'Customização': ['Customização', 'customization']
    };

    const categoriesMatch = (promoCategory: string, productCategory: string) => {
      if (promoCategory === productCategory) return true;
      const mappedCategories = categoryMapping[promoCategory] || [];
      return mappedCategories.includes(productCategory);
    };

    // Encontrar promoção individual para este produto
    const individualPromotion = promotions.find(promo => 
      promo.active && 
      promo.promotion_type === 'single_product' && 
      promo.product_id === productId &&
      promo.discount_percent > 0
    );

    // Encontrar promoções de quantidade que afetam este produto
    const quantityPromotions = promotions.filter(promo => 
      promo.active && 
      promo.promotion_type === 'buy_x_get_y' &&
      promo.target_category &&
      categoriesMatch(promo.target_category, productCategory) &&
      promo.min_quantity &&
      promo.get_quantity
    );

    // Se não há promoção individual, permitir aplicação normal
    if (!individualPromotion) {
      return {
        shouldApplyIndividualPromotion: true,
        bestPromotionType: 'none' as const,
        conflictingPromotions: [],
        reasoning: 'Nenhuma promoção individual encontrada'
      };
    }

    // Se não há promoções de quantidade, aplicar individual
    if (quantityPromotions.length === 0) {
      return {
        shouldApplyIndividualPromotion: true,
        bestPromotionType: 'individual' as const,
        conflictingPromotions: [individualPromotion.title],
        reasoning: 'Apenas promoção individual disponível'
      };
    }

    // Verificar se alguma promoção de quantidade se aplica
    const currentProduct = cartItems.find(item => item.id === productId);
    if (!currentProduct) {
      return {
        shouldApplyIndividualPromotion: true,
        bestPromotionType: 'individual' as const,
        conflictingPromotions: [individualPromotion.title],
        reasoning: 'Produto não encontrado no carrinho'
      };
    }

    // Calcular benefício da promoção individual
    const individualDiscount = currentProduct.price * currentProduct.quantity * (individualPromotion.discount_percent / 100);

    // Calcular benefício das promoções de quantidade
    let bestQuantityBenefit = 0;
    let bestQuantityPromotion = null;

    for (const quantityPromo of quantityPromotions) {
      // Filtrar itens da categoria da promoção
      const categoryItems = cartItems.filter(item => 
        categoriesMatch(quantityPromo.target_category!, item.category)
      );

      const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);

      if (totalQuantity >= quantityPromo.get_quantity!) {
        // Calcular economia da promoção "Leve X pague Y"
        const setsCompletos = Math.floor(totalQuantity / quantityPromo.get_quantity!);
        const totalItemsToPayFor = setsCompletos * quantityPromo.min_quantity!;
        const totalItemsToGetFree = (setsCompletos * quantityPromo.get_quantity!) - totalItemsToPayFor;

        // Ordenar itens por preço (maior primeiro) para calcular economia correta
        const sortedItems = [...categoryItems].sort((a, b) => b.price - a.price);
        
        let freeItemsRemaining = Math.min(totalItemsToGetFree, totalQuantity);
        let savings = 0;
        
        for (const item of sortedItems) {
          if (freeItemsRemaining <= 0) break;
          const itemsToDiscount = Math.min(freeItemsRemaining, item.quantity);
          savings += itemsToDiscount * item.price;
          freeItemsRemaining -= itemsToDiscount;
        }

        if (savings > bestQuantityBenefit) {
          bestQuantityBenefit = savings;
          bestQuantityPromotion = quantityPromo;
        }
      }
    }

  logger.debug('🔍 Análise de conflito de promoções:', {
      productId,
      individualPromotion: individualPromotion.title,
      individualDiscount,
      bestQuantityPromotion: bestQuantityPromotion?.title,
      bestQuantityBenefit,
      currentQuantity: currentProduct.quantity
    });

    // Decidir qual promoção aplicar
    if (bestQuantityBenefit > individualDiscount) {
      return {
        shouldApplyIndividualPromotion: false,
        bestPromotionType: 'quantity' as const,
        conflictingPromotions: [individualPromotion.title, bestQuantityPromotion!.title],
        reasoning: `Promoção de quantidade é mais vantajosa (R$ ${bestQuantityBenefit.toFixed(2)} vs R$ ${individualDiscount.toFixed(2)})`
      };
    } else {
      return {
        shouldApplyIndividualPromotion: true,
        bestPromotionType: 'individual' as const,
        conflictingPromotions: [individualPromotion.title],
        reasoning: `Promoção individual é mais vantajosa (R$ ${individualDiscount.toFixed(2)} vs R$ ${bestQuantityBenefit.toFixed(2)})`
      };
    }

  }, [promotions, productId, productCategory, cartItems]);

  return result;
};
