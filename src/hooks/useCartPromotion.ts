import { useState, useEffect } from 'react';
import { usePromotions } from './useFetch';

interface CartPromotionResult {
  promotionApplied: boolean;
  originalTotal: number;
  discountedTotal: number;
  savings: number;
  promotionTitle: string;
  promotionDetails: string;
}

interface CartItem {
  id: string;
  category: string;
  price: number;
  quantity: number;
}

export const useCartPromotion = (cartItems: CartItem[]): CartPromotionResult => {
  const { promotions } = usePromotions();
  const [result, setResult] = useState<CartPromotionResult>({
    promotionApplied: false,
    originalTotal: 0,
    discountedTotal: 0,
    savings: 0,
    promotionTitle: '',
    promotionDetails: ''
  });

  // Memoize cart items length and total to prevent unnecessary recalculations
  const cartItemsLength = cartItems.length;
  const cartItemsString = JSON.stringify(cartItems.map(item => ({
    id: item.id,
    category: item.category,
    price: item.price,
    quantity: item.quantity
  })));

  useEffect(() => {
    console.log('🔄 useCartPromotion called with:', { cartItemsLength: cartItems.length, promotionsLength: promotions?.length });
    
    if (!promotions || !cartItems.length) {
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setResult({
        promotionApplied: false,
        originalTotal: total,
        discountedTotal: total,
        savings: 0,
        promotionTitle: '',
        promotionDetails: ''
      });
      return;
    }

    console.log('🛒 Calculando promoções do carrinho:', { cartItems, promotions });

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

    const originalTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('💰 Subtotal original calculado:', { 
      originalTotal, 
      itemBreakdown: cartItems.map(item => ({ 
        id: item.id, 
        price: item.price, 
        quantity: item.quantity, 
        subtotal: item.price * item.quantity 
      }))
    });
    
    let bestPromotion = null;
    let bestSavings = 0;
    let bestTotal = originalTotal;

    // Verificar promoções Buy X Get Y
    const buyXGetYPromotions = promotions.filter(promo => 
      promo.active && promo.promotion_type === 'buy_x_get_y'
    );

    console.log('🎯 Promoções Buy X Get Y encontradas:', buyXGetYPromotions);

    for (const promo of buyXGetYPromotions) {
      console.log('🔍 Verificando promoção:', promo.title);
      
      if (!promo.target_category || !promo.min_quantity || !promo.get_quantity) {
        console.log('❌ Promoção incompleta:', { target_category: promo.target_category, min_quantity: promo.min_quantity, get_quantity: promo.get_quantity });
        continue;
      }

      // Agrupar itens por categoria primeiro
      const categoryItems = cartItems.filter(item => 
        categoriesMatch(promo.target_category!, item.category)
      );

      console.log('📦 Itens da categoria:', { 
        promoCategory: promo.target_category, 
        categoryItems: categoryItems.map(item => ({ id: item.id, category: item.category, quantity: item.quantity }))
      });

      if (categoryItems.length === 0) {
        console.log('❌ Nenhum item da categoria encontrado');
        continue;
      }

      // 🎯 NOVA LÓGICA: Agrupar por produto específico (mesmo ID)
      // Para "Pague 1 Leve 2" deve ser o MESMO produto, não produtos diferentes da mesma categoria
      const productGroups: { [productId: string]: CartItem[] } = {};
      
      categoryItems.forEach(item => {
        if (!productGroups[item.id]) {
          productGroups[item.id] = [];
        }
        productGroups[item.id].push(item);
      });

      console.log('🔍 Produtos agrupados:', Object.keys(productGroups).map(id => ({
        productId: id,
        totalQuantity: productGroups[id].reduce((sum, item) => sum + item.quantity, 0)
      })));

      // 🎯 NOVA LÓGICA: Aplicar promoção em TODOS os produtos que qualificam
      let totalBuyXGetYSavings = 0;
      const qualifyingProducts: string[] = [];

      for (const [productId, items] of Object.entries(productGroups)) {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        
        console.log(`📊 Produto ${productId}: ${totalQuantity} unidades (mínimo necessário: ${promo.get_quantity})`);
        
        if (totalQuantity >= promo.get_quantity) {
          // Calcular economia para este produto específico
          const productPrice = items[0].price;
          const totalNeeded = promo.get_quantity;
          const setsCompletos = Math.floor(totalQuantity / totalNeeded);
          const totalItemsToGetFree = setsCompletos * (promo.get_quantity - promo.min_quantity);
          const productSavings = Math.min(totalItemsToGetFree, totalQuantity) * productPrice;
          
          console.log(`💰 Promoção APLICADA para produto ${productId}:`, {
            totalQuantity,
            setsCompletos,
            totalItemsToGetFree,
            savings: productSavings
          });

          // ✅ Adicionar as economias de TODOS os produtos qualificados
          totalBuyXGetYSavings += productSavings;
          qualifyingProducts.push(productId);
        }
      }

      if (qualifyingProducts.length === 0) {
        console.log('❌ Nenhum produto específico tem quantidade suficiente para a promoção');
        continue;
      }

      console.log(`🎯 Aplicando promoção para ${qualifyingProducts.length} produtos:`, {
        products: qualifyingProducts,
        totalSavings: totalBuyXGetYSavings,
        requiredQuantity: promo.get_quantity
      });

      if (totalBuyXGetYSavings > bestSavings) {
        bestSavings = totalBuyXGetYSavings;
        const currentBestTotal = originalTotal - totalBuyXGetYSavings;
        bestTotal = currentBestTotal;
        bestPromotion = {
          ...promo,
          details: `Leve ${promo.get_quantity} unidades do mesmo produto e pague apenas ${promo.min_quantity}!`
        };
        
        console.log('🏆 Nova melhor promoção (múltiplos produtos):', {
          title: bestPromotion.title,
          qualifyingProducts,
          totalSavings: bestSavings,
          originalTotal,
          calculatedTotal: currentBestTotal,
          type: 'buy_x_get_y'
        });

        // 🎯 TODOS os produtos qualificados terão promoções individuais suprimidas
        console.log('⚠️ Promoções individuais serão suprimidas para produtos:', qualifyingProducts);
      } else {
        console.log('❌ Economia total insuficiente para ser a melhor promoção');
      }
    }

    // Verificar outras promoções (categoria, condicional, etc.)
    // IMPORTANTE: Excluir single_product para evitar dupla aplicação com usePromotion
    const otherPromotions = promotions.filter(promo => 
      promo.active && 
      promo.discount_percent > 0 && 
      promo.promotion_type !== 'buy_x_get_y' &&
      promo.promotion_type !== 'single_product' && // Removido para evitar conflito
      promo.promotion_type !== 'combo'
    );

    console.log('🎯 Outras promoções (sem single_product):', otherPromotions.map(p => ({ title: p.title, type: p.promotion_type })));

    for (const promo of otherPromotions) {
      let savings = 0;

      if (promo.promotion_type === 'category' && promo.target_category) {
        const categoryItems = cartItems.filter(item => 
          categoriesMatch(promo.target_category!, item.category)
        );
        savings = categoryItems.reduce((sum, item) => 
          sum + (item.price * item.quantity * promo.discount_percent / 100), 0
        );
      } else if (promo.promotion_type === 'conditional') {
        if (originalTotal >= (promo.conditions?.min_purchase_amount || 0)) {
          savings = originalTotal * promo.discount_percent / 100;
        }
      }

      if (savings > bestSavings) {
        bestSavings = savings;
        bestTotal = originalTotal - savings;
        bestPromotion = {
          ...promo,
          details: `${promo.discount_percent}% OFF ${promo.promotion_type === 'category' ? `em ${promo.target_category}` : 'na compra'}`
        };
      }
    }

    setResult({
      promotionApplied: bestPromotion !== null,
      originalTotal,
      discountedTotal: bestTotal,
      savings: bestSavings,
      promotionTitle: bestPromotion?.title || '',
      promotionDetails: bestPromotion?.details || ''
    });

  }, [promotions, cartItemsLength, cartItemsString]);

  return result;
};
