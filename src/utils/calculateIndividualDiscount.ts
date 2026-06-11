import { promotionMatchesProductCategory } from "./categoryMapping";

export interface PromotionLike {
  active: boolean;
  promotion_type: string;
  product_id?: string;
  target_category?: string;
  combo_products?: string[];
  discount_percent: number;
  title?: string;
  conditions?: { min_purchase_amount?: number };
}

export function calculateIndividualDiscount(
  promotions: PromotionLike[] | undefined,
  productId: string,
  originalPrice: number,
  productCategory?: string
): { hasDiscount: boolean; discountedPrice: number; promotionTitle?: string } {
  if (!promotions || !productId) return { hasDiscount: false, discountedPrice: originalPrice };

  const activePromotion = promotions
    .filter((promo) => {
      const isActive = promo.active;
      const matchesSingleProduct =
        promo.promotion_type === "single_product" && promo.product_id === productId && promo.discount_percent > 0;
      const matchesCategory =
        promo.promotion_type === "category" &&
        promo.target_category &&
        promotionMatchesProductCategory(promo.target_category, productCategory) &&
        promo.discount_percent > 0;
      const matchesCombo =
        promo.promotion_type === "combo" && promo.combo_products?.includes(productId) && promo.discount_percent > 0;
      const matchesConditional = promo.promotion_type === "conditional" && promo.discount_percent > 0;

      return isActive && (matchesSingleProduct || matchesCategory || matchesCombo || matchesConditional);
    })
    .sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        single_product: 1,
        combo: 2,
        category: 3,
        conditional: 4,
      };

      const pa = priorityOrder[a.promotion_type] || 999;
      const pb = priorityOrder[b.promotion_type] || 999;

      if (pa === pb) return b.discount_percent - a.discount_percent;
      return pa - pb;
    })[0];

  if (!activePromotion) return { hasDiscount: false, discountedPrice: originalPrice };

  const discountAmount = (originalPrice * activePromotion.discount_percent) / 100;
  const discountedPrice = originalPrice - discountAmount;

  return {
    hasDiscount: true,
    discountedPrice,
    promotionTitle: activePromotion.title || "Promoção especial",
  };
}
