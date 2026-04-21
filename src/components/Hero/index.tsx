import { useEffect, useState } from "react";

import { CategoryNav } from "../CategoryNav";
import { MainSlider } from "../MainSlider";
import { useNavigate } from "react-router-dom";

import promoImg1 from "../../assets/images/iphone-13-pro.png";
import promoImg2 from "../../assets/images/jbl-xtreme.png";
import { useBanners, usePromotions } from "../../hooks/useFetch";
import { categoryIdToName } from "../../utils/categoryMapping";
import { logger } from "../../utils/logger";

export const Hero = () => {
  const { promotions, loading: promotionsLoading } = usePromotions();
  const navigate = useNavigate();

  // Sincroniza o skeleton das promoções com os banners (MainSlider)
  // pra evitar que os cards "terminem" antes do slider.
  const { loading: bannersLoading } = useBanners();

  // Mantém o skeleton visível por um tempo mínimo pra dar sensação de carregamento
  const MIN_HERO_LOADING_MS = 900;
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    setMinDelayDone(false);
    const t = window.setTimeout(() => setMinDelayDone(true), MIN_HERO_LOADING_MS);
    return () => window.clearTimeout(t);
  }, []);

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
          // Converter ID de categoria para nome
          const categoryName = categoryIdToName(promotion.target_category);
          logger.debug('🎯 Redirecionando para categoria:', { 
            original: promotion.target_category, 
            mapped: categoryName 
          });
          
          navigate(`/products?category=${encodeURIComponent(categoryName)}`);
        } else {
          navigate('/products');
        }
        break;
      case 'buy_x_get_y':
        // Para promoções "compre X leve Y", navegar para produtos da categoria alvo
        if (promotion.target_category) {
          // Converter ID de categoria para nome
          const categoryName = categoryIdToName(promotion.target_category);
          navigate(`/products?category=${encodeURIComponent(categoryName)}&promo=buy_x_get_y`);
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

  // Considera "loading" também enquanto não cumpriu o delay mínimo
  // e sincroniza com o carregamento de banners.
  const showHeroLoading = promotionsLoading || bannersLoading || !minDelayDone;

  // Enquanto carrega promoções, manter o gap do layout final (evita o skeleton grudar na sidebar)
  const shouldUsePromoLayoutGap = hasActivePromotions || showHeroLoading;



  // Renderizar promoções ou produtos em destaque
  const renderPromoArea = () => {

    // Se tem promoções para o banner, mostrar promoções
    if (hasActivePromotions) {
      const promo1 = bannerPromotions.find(p => p.position === 1);
      const promo2 = bannerPromotions.find(p => p.position === 2);

      return (
  <div className="w-full max-w-lg mx-auto lg:max-w-none lg:flex lg:flex-col lg:items-start lg:gap-4 lgxl:max-w-none lgxl:w-full">
          {/* promo 1 */}
          {promo1 && (
            <div className="grad h-[300px] sm:h-[320px] md:h-[340px] lg:h-[242px] rounded-[8px] overflow-hidden relative p-4 flex flex-col lg:justify-between lg:w-64">
              <div className="absolute top-2 right-2 bg-accent text-primary text-[12px] sm:text-[13px] font-bold px-2.5 py-1.5 rounded lg:text-[10px] lg:px-2 lg:py-1">
                -{promo1.discount_percent}%
              </div>

              {/* Conteúdo (mobile: centralizado / desktop: alinhado como antes) */}
              <div className="flex flex-col items-center text-center gap-2 lg:items-start lg:text-left lg:gap-0">
                <div className="text-[18px] sm:text-[20px] uppercase font-medium leading-tight font-primary max-w-[240px] lg:text-[14px] lg:font-medium lg:mb-3 lg:max-w-[180px]">
                  {promo1.title || `${promo1.discount_percent}% OFF`}
                </div>

                {/* CTA (desktop) */}
                <button
                  onClick={() => handlePromoClick(promo1)}
                  className="hidden lg:inline-flex uppercase text-accent font-semibold text-[12px] hover:text-accent/80 transition-colors cursor-pointer"
                >
                  {getButtonText(promo1)}
                </button>
              </div>

              {/* Imagem (mobile: maior e central / desktop: como antes) */}
              <div className="mt-auto flex justify-center items-center h-[170px] sm:h-[190px] md:h-[210px] lg:mt-0 lg:h-[120px] lg:items-end">
                <img
                  className="max-h-[150px] sm:max-h-[165px] md:max-h-[185px] lg:max-h-[110px] max-w-[200px] lg:max-w-[140px] object-contain rounded-md"
                  src={promo1.image_url || promoImg1}
                  alt={promo1.title}
                />
              </div>

              {/* CTA (mobile: abaixo da imagem / desktop: fica no topo como antes) */}
        <div className="pt-4 sm:pt-5 flex justify-center lg:hidden">
                <button
                  onClick={() => handlePromoClick(promo1)}
          className="uppercase text-accent font-semibold text-[13px] sm:text-[14px] hover:text-accent/80 transition-colors cursor-pointer"
                >
                  {getButtonText(promo1)}
                </button>
              </div>
            </div>
          )}

          {/* promo 2 */}
          {promo2 && (
            <div className="grad h-[300px] sm:h-[320px] md:h-[340px] lg:h-[242px] rounded-[8px] overflow-hidden relative p-4 flex flex-col lg:justify-between lg:w-64">
              <div className="absolute top-2 right-2 bg-accent text-primary text-[12px] sm:text-[13px] font-bold px-2.5 py-1.5 rounded lg:text-[10px] lg:px-2 lg:py-1">
                -{promo2.discount_percent}%
              </div>

              {/* Conteúdo (mobile: centralizado / desktop: alinhado como antes) */}
              <div className="flex flex-col items-center text-center gap-2 lg:items-start lg:text-left lg:gap-0">
                <div className="text-[18px] sm:text-[20px] uppercase font-medium leading-tight font-primary max-w-[240px] lg:text-[14px] lg:font-medium lg:mb-3 lg:max-w-[180px]">
                  {promo2.title || `${promo2.discount_percent}% OFF`}
                </div>

                {/* CTA (desktop) */}
                <button
                  onClick={() => handlePromoClick(promo2)}
                  className="hidden lg:inline-flex uppercase text-accent font-semibold text-[12px] hover:text-accent/80 transition-colors cursor-pointer"
                >
                  {getButtonText(promo2)}
                </button>
              </div>

              {/* Imagem (mobile: maior e central / desktop: como antes) */}
              <div className="mt-auto flex justify-center items-center h-[170px] sm:h-[190px] md:h-[210px] lg:mt-0 lg:h-[120px] lg:items-end">
                <img
                  className="max-h-[150px] sm:max-h-[165px] md:max-h-[185px] lg:max-h-[110px] max-w-[200px] lg:max-w-[140px] object-contain rounded-md"
                  src={promo2.image_url || promoImg2}
                  alt={promo2.title}
                />
              </div>

              {/* CTA (mobile: abaixo da imagem / desktop: fica no topo como antes) */}
        <div className="pt-4 sm:pt-5 flex justify-center lg:hidden">
                <button
                  onClick={() => handlePromoClick(promo2)}
          className="uppercase text-accent font-semibold text-[13px] sm:text-[14px] hover:text-accent/80 transition-colors cursor-pointer"
                >
                  {getButtonText(promo2)}
                </button>
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
  <section className="mb-[30px] pt-36 lg:pt-0 lgxl:pt-10 xl:pt-0">
      {/* Entre 1024–1359 (lgxl até antes do xl), deixamos o layout mais "wide" e levamos os cards pra baixo */}
  <div className="container mx-auto">
        <div
          className={
            `flex flex-col gap-y-[30px] lgxl:flex-row overflow-x-hidden lgxl:gap-x-[20px] ` +
            (shouldUsePromoLayoutGap ? "xl:gap-x-[30px]" : "xl:gap-x-0")
          }
        >
          {/* sidebar */}
          <div className="lgxl:flex-shrink-0">
            <CategoryNav />
          </div>
          {/* main slider */}
          <div className={`w-full mx-auto ${
            shouldUsePromoLayoutGap 
              ? 'lgxl:flex-1 lgxl:min-w-0' 
              : 'lgxl:max-w-full'
          }`}>
            <MainSlider />
          </div>
          {/* promo area (desktop grande ≥1360): continua na lateral */}
          {(hasActivePromotions || showHeroLoading) && (
            <div className="hidden xl:block xl:flex-shrink-0 xl:w-64">
              {hasActivePromotions ? (
                renderPromoArea()
              ) : (
          <div className="w-full max-w-lg mx-auto xl:max-w-none xl:w-full flex flex-col gap-4">
            <div className="grad h-[300px] sm:h-[320px] md:h-[340px] lg:h-[242px] rounded-[8px] overflow-hidden relative p-4 animate-pulse" />
            <div className="grad h-[300px] sm:h-[320px] md:h-[340px] lg:h-[242px] rounded-[8px] overflow-hidden relative p-4 animate-pulse" />
                </div>
              )}
            </div>
          )}
        </div>

    {/* promo area (mobile/tablet): mantém o comportamento antigo (cards em 1 coluna)
      Ajuste extra em 960–1023px (lg): conter a largura para não ficar largo demais. */}
    {(hasActivePromotions || showHeroLoading) && (
      <div className="lgxl:hidden mt-[30px]">
            {hasActivePromotions ? (
              renderPromoArea()
            ) : (
              <div className="w-full max-w-lg mx-auto flex flex-col gap-4 lg:max-w-none lg:items-start">
                <div className="grad h-[300px] sm:h-[320px] md:h-[340px] lg:h-[242px] rounded-[8px] overflow-hidden relative p-4 animate-pulse lg:w-64" />
                <div className="grad h-[300px] sm:h-[320px] md:h-[340px] lg:h-[242px] rounded-[8px] overflow-hidden relative p-4 animate-pulse lg:w-64" />
              </div>
            )}
          </div>
        )}

        {/* promo area (1024–1359): vai pra baixo pra liberar largura do slider */}
        {(hasActivePromotions || showHeroLoading) && (
          <div className="hidden lgxl:block xl:hidden mt-[30px]">
            {hasActivePromotions ? (
              <div className="w-full max-w-[544px]">
                <div className="grid grid-cols-2 gap-4">
                {bannerPromotions
                  .filter((p) => p.position === 1 || p.position === 2)
                  .sort((a, b) => a.position - b.position)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="grad h-[242px] rounded-[8px] overflow-hidden relative p-4 flex flex-col justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="text-[14px] uppercase font-medium leading-tight mb-3 max-w-[180px] font-primary">
                          {p.title || `${p.discount_percent}% OFF`}
                        </div>
                        <button
                          onClick={() => handlePromoClick(p)}
                          className="uppercase text-accent font-semibold text-[12px] hover:text-accent/80 transition-colors w-fit cursor-pointer"
                        >
                          {getButtonText(p)}
                        </button>
                      </div>
                      <div className="flex justify-center items-end h-[120px]">
                        <img
                          className="max-h-[110px] max-w-[170px] object-contain"
                          src={p.image_url || (p.position === 2 ? promoImg2 : promoImg1)}
                          alt={p.title}
                        />
                      </div>
                      <div className="absolute top-2 right-2 bg-accent text-primary text-[10px] font-bold px-2 py-1 rounded">
                        -{p.discount_percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[544px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grad h-[242px] rounded-[8px] overflow-hidden relative p-4 animate-pulse" />
                  <div className="grad h-[242px] rounded-[8px] overflow-hidden relative p-4 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
