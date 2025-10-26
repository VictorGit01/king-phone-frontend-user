import { CategoryNav } from "../CategoryNav";
import { MainSlider } from "../MainSlider";
import { ProductSlider } from "../ProductSlider";
import { useNavigate } from "react-router-dom";

import promoImg1 from "../../assets/images/iphone-13-pro.png";
import promoImg2 from "../../assets/images/jbl-xtreme.png";
import { usePromotions, useProducts } from "../../hooks/useFetch";

export const Hero = () => {
  const { promotions } = usePromotions();
  const { data: products } = useProducts();
  const navigate = useNavigate();

  // Função para lidar com cliques nos botões das promoções
  const handlePromoClick = (promotion: any) => {
    switch (promotion.promotion_type) {
      case 'single_product':
        if (promotion.product_id) {
          navigate(`/product/${promotion.product_id}`);
        } else {
          navigate('/');
        }
        break;
      case 'category':
        if (promotion.target_category) {
          // Mapeamento simplificado para compatibilidade com promoções antigas
          const categoryMapping: { [key: string]: string } = {
            'smartphone': 'Smartphones',
            'headphone': 'Fones de ouvido',
            'smartwatch': 'Dispositivos vestíveis',
            'charger': 'Carregadores',
            'assistant': 'Assistentes virtuais',
            'customization': 'Customização'
          };
          
          const mappedCategory = categoryMapping[promotion.target_category] || promotion.target_category;
          console.log('🎯 Redirecionando para categoria:', { 
            original: promotion.target_category, 
            mapped: mappedCategory 
          });
          
          navigate(`/products?category=${encodeURIComponent(mappedCategory)}`);
        } else {
          navigate('/products');
        }
        break;
      case 'buy_x_get_y':
        // Para promoções "compre X leve Y", navegar para produtos da categoria alvo
        if (promotion.target_category) {
          // Mapeamento simplificado para compatibilidade com promoções antigas
          const categoryMapping: { [key: string]: string } = {
            'smartphone': 'Smartphones',
            'headphone': 'Fones de ouvido',
            'smartwatch': 'Dispositivos vestíveis',
            'charger': 'Carregadores',
            'assistant': 'Assistentes virtuais',
            'customization': 'Customização'
          };
          
          const mappedCategory = categoryMapping[promotion.target_category] || promotion.target_category;
          navigate(`/products?category=${encodeURIComponent(mappedCategory)}&promo=buy_x_get_y`);
        } else {
          navigate('/products?promo=buy_x_get_y');
        }
        break;
      case 'combo':
        // Para combos, navegar para uma página de produtos em oferta
        navigate('/products?promo=combo');
        break;
      case 'conditional':
        // Para promoções condicionais, navegar para produtos
        navigate('/products?promo=conditional');
        break;
      default:
        navigate('/products');
    }
  };

  // Função para determinar o texto do botão baseado no tipo de promoção
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

  // Filtrar apenas promoções ativas com posição válida (1 ou 2) - não precisa mais do show_in_banner
  const bannerPromotions = promotions?.filter(p => 
    p.active && 
    p.discount_percent > 0 &&
    p.position > 0 // Posição 1 ou 2 = aparece no banner, Posição 0 = não aparece
  ) || [];

  const hasActivePromotions = bannerPromotions.length > 0;



  // Renderizar promoções ou produtos em destaque
  const renderPromoArea = () => {

    // Se tem promoções para o banner, mostrar promoções
    if (hasActivePromotions) {
      const promo1 = bannerPromotions.find(p => p.position === 1);
      const promo2 = bannerPromotions.find(p => p.position === 2);

      return (
        <div 
          className="w-full max-w-sm mx-auto xl:max-w-none xl:w-full h-[500px]"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* promo 1 */}
          {promo1 && (
            <div className="grad h-[242px] rounded-[8px] overflow-hidden relative p-4 flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="text-[14px] uppercase font-medium leading-tight mb-3 max-w-[180px] font-primary">
                  {promo1.title || `${promo1.discount_percent}% OFF`}
                </div>
                <button 
                  onClick={() => handlePromoClick(promo1)}
                  className="uppercase text-accent font-semibold text-[12px] hover:text-accent/80 transition-colors w-fit cursor-pointer"
                >
                  {getButtonText(promo1)}
                </button>
              </div>
              <div className="flex justify-center items-end h-[120px]">
                <img
                  className="max-h-[110px] max-w-[140px] object-contain"
                  src={promo1.image_url || promoImg1}
                  alt={promo1.title}
                />
              </div>
              <div className="absolute top-2 right-2 bg-accent text-primary text-[10px] font-bold px-2 py-1 rounded">
                -{promo1.discount_percent}%
              </div>
            </div>
          )}

          {/* promo 2 */}
          {promo2 && (
            <div className="grad h-[242px] rounded-[8px] overflow-hidden relative p-4 flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="text-[14px] uppercase font-medium leading-tight mb-3 max-w-[180px] font-primary">
                  {promo2.title || `${promo2.discount_percent}% OFF`}
                </div>
                <button 
                  onClick={() => handlePromoClick(promo2)}
                  className="uppercase text-accent font-semibold text-[12px] hover:text-accent/80 transition-colors w-fit cursor-pointer"
                >
                  {getButtonText(promo2)}
                </button>
              </div>
              <div className="flex justify-center items-end h-[120px]">
                <img
                  className="max-h-[110px] max-w-[140px] object-contain"
                  src={promo2.image_url || promoImg2}
                  alt={promo2.title}
                />
              </div>
              <div className="absolute top-2 right-2 bg-accent text-primary text-[10px] font-bold px-2 py-1 rounded">
                -{promo2.discount_percent}%
              </div>
            </div>
          )}
        </div>
      );
    }

    // Se não há promoções da API, não mostrar nada nesta área
    return null;
  };

  return (
    <section className="mb-[30px] pt-36 lg:pt-0">
      <div className="container mx-auto">
        <div className={`flex flex-col gap-y-[30px] xl:flex-row overflow-x-hidden ${
          hasActivePromotions ? 'xl:gap-x-[30px]' : 'xl:gap-x-0'
        }`}>
          {/* sidebar */}
          <div className="xl:flex-shrink-0">
            <CategoryNav />
          </div>
          {/* main slider */}
          <div className={`w-full mx-auto ${
            hasActivePromotions 
              ? 'xl:flex-[2] xl:min-w-0' 
              : 'xl:max-w-full'
          }`}>
            <MainSlider />
          </div>
          {/* promo area - só aparece se houver promoções ativas no banner */}
          {hasActivePromotions && (
            <div className="xl:flex-shrink-0 xl:w-64">
              {renderPromoArea()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
