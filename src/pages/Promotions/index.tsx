import { useState, useEffect } from "react";
import { usePromotions } from "../../hooks/useFetch";
import { Product } from "../../components/Product";
import { useProducts } from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import { categoryIdToName } from "../../utils/categoryMapping";

export const Promotions = () => {
  const { promotions, loading: promotionsLoading } = usePromotions();
  const { data: products, loading: productsLoading } = useProducts();

  // Função para adaptar produtos da API para o formato esperado pelo componente
  const adaptApiProduct = (apiProduct: any) => {
    return {
      id: apiProduct.id,
      title: apiProduct.name,
      description: apiProduct.details,
      price: apiProduct.price,
      image_url: apiProduct.files?.[0]?.url || "/placeholder-image.jpg",
      category: apiProduct.category,
      category_id: apiProduct.category,
      is_new: true,
    };
  };

  // Converter produtos da API para o formato esperado
  const allProducts = products ? products.map(adaptApiProduct) : [];

  // Filtrar apenas promoções ativas
  const activePromotions = promotions?.filter(promo => {
    const isActive = promo.active;
    const hasDiscount = promo.discount_percent > 0;
    const isBuyXGetY = promo.promotion_type === 'buy_x_get_y' && promo.min_quantity && promo.get_quantity;
    
    console.log('🔍 Analisando promoção:', {
      id: promo.id,
      title: promo.title,
      type: promo.promotion_type,
      active: isActive,
      discount: promo.discount_percent,
      minQty: promo.min_quantity,
      getQty: promo.get_quantity,
      hasDiscount,
      isBuyXGetY,
      willShow: isActive && (hasDiscount || isBuyXGetY),
      rawPromo: promo // Mostrar objeto completo para debug
    });
    
    return isActive && (hasDiscount || isBuyXGetY);
  }) || [];

  // Debug adicional para todas as promoções
  console.log('📋 TODAS as promoções recebidas:', promotions);
  console.log('🎉 Promoções ativas encontradas:', activePromotions);

  // Componente para card de promoção
  const PromotionCard = ({ promotion }: { promotion: any }) => {
    const getPromotionDescription = () => {
      switch (promotion.promotion_type) {
        case 'single_product':
          const product = allProducts.find(p => p.id === promotion.product_id);
          return `${promotion.discount_percent}% OFF em ${product?.title || 'produto selecionado'}`;
        case 'category':
          const categoryName = categoryIdToName(promotion.target_category);
          return `${promotion.discount_percent}% OFF em ${categoryName}`;
        case 'buy_x_get_y':
          const totalItems = (promotion.min_quantity || 3) + (promotion.get_quantity || 1);
          const categoryNameBuyX = categoryIdToName(promotion.target_category);
          return `Leve ${totalItems} ${categoryNameBuyX} e pague apenas ${promotion.min_quantity || 3}!`;
        case 'combo':
          return `Combo especial com ${promotion.discount_percent}% OFF`;
        case 'conditional':
          return `${promotion.discount_percent}% OFF em compras acima de R$ ${promotion.conditions?.min_purchase_amount || 0}`;
        default:
          return promotion.description;
      }
    };

    const getPromotionAction = () => {
      if (promotion.promotion_type === 'single_product' && promotion.product_id) {
        return `/products/${promotion.product_id}`;
      }
      if (promotion.target_category) {
        // Converter ID para nome antes de criar a URL
        const categoryName = categoryIdToName(promotion.target_category);
        return `/products?category=${encodeURIComponent(categoryName)}`;
      }
      return '/products';
    };

    // Função para determinar o texto do botão (igual ao Hero)
    const getButtonText = (promotion: any) => {
      switch (promotion.promotion_type) {
        case 'single_product':
          return 'PEDIR AGORA';
        case 'category':
          return 'VER CATEGORIA';
        case 'buy_x_get_y':
          return 'APROVEITAR OFERTA';
        case 'combo':
          return 'VER COMBO';
        case 'conditional':
          return 'GARANTIR DESCONTO';
        default:
          return 'VER OFERTAS';
      }
    };

    return (
      <div className="bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-700 flex flex-col h-full">
        <div className="relative">
          <img 
            src={promotion.image_url} 
            alt={promotion.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {promotion.promotion_type === 'buy_x_get_y' ? 'LEVE GRÁTIS' : `${promotion.discount_percent}% OFF`}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-2">{promotion.title}</h3>
          <p className="text-gray-300 mb-4 text-sm flex-grow">{getPromotionDescription()}</p>
          <Link 
            to={getPromotionAction()}
            className="inline-block bg-accent hover:bg-accent/90 text-primary font-bold py-2.5 px-5 rounded-lg transition-colors duration-300 w-full text-center text-sm mt-auto"
          >
            {getButtonText(promotion)}
          </Link>
        </div>
      </div>
    );
  };

  if (promotionsLoading || productsLoading) {
    return (
      <div className="mb-16 pt-40 lg:pt-0">
        <div className="container mx-auto px-4">
          <div className="py-8 text-xl uppercase text-center">
            Carregando promoções...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 pt-40 lg:pt-0">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-white">
            🎉 Todas as Promoções
          </h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto">
            Confira todas as ofertas e promoções especiais disponíveis. 
            Não perca essas oportunidades incríveis!
          </p>
        </div>

        {activePromotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="text-2xl text-gray-300 mb-4">😴</div>
            <div className="text-xl text-gray-300 mb-2">
              Nenhuma promoção ativa no momento
            </div>
            <div className="text-gray-500">
              Fique ligado para as próximas ofertas!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 max-w-7xl mx-auto">
            {activePromotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
