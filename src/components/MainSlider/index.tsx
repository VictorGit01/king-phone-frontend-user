import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../slider.css";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import iphoneImg from "../../assets/images/iphone-14.png";
import { useBanners, useSettings } from "../../hooks/useFetch";

export const MainSlider = () => {
  const { banners, loading } = useBanners();
  const { settings } = useSettings();

  // Mantém o placeholder de loading visível por um tempo mínimo
  // (pra sincronizar com o skeleton do Hero e evitar "piscar" rápido demais)
  const MIN_BANNER_LOADING_MS = 900;
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    setMinDelayDone(false);
    const t = window.setTimeout(() => setMinDelayDone(true), MIN_BANNER_LOADING_MS);
    return () => window.clearTimeout(t);
  }, []);

  const showBannerLoading = loading || !minDelayDone;

  // Banner estático padrão
  const staticBanner = {
    id: 'static-banner',
    title: 'Bem-vindo à King Phone',
    description: 'Os melhores celulares e acessórios você encontra aqui',
    image_url: iphoneImg,
    link_url: '/products',
    active: true,
    order: 0,
    layout: 'left-content' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Lógica para determinar quais banners mostrar:
  // 1. Sempre incluir banners customizados se existirem
  // 2. Incluir banner estático se estiver ativado (independente de ter banners customizados)
  // 3. Se não há banners customizados e banner estático está desativado, não mostrar nada
  const shouldShowStaticBanner = settings.show_static_banner !== false;
  
  let slidersToShow = [...banners]; // Começar com banners customizados
  
  if (shouldShowStaticBanner) {
    slidersToShow = [staticBanner, ...banners]; // Adicionar banner estático no início
  }
  
  // Se não tem nenhum banner para mostrar, array vazio
  if (slidersToShow.length === 0) {
    slidersToShow = [];
  }

  if (showBannerLoading) {
    return (
      <div
  className="main-slider w-full mx-auto bg-primary rounded-[8px] overflow-hidden drop-shadow-2xl flex items-center justify-center max-w-lg lg:max-w-none h-[clamp(610px,75vh,760px)] md:h-[clamp(700px,80vh,820px)] lg:h-[460px] xl:h-[500px]"
      >
        <div className="grad w-full h-full p-[20px] md:p-[60px] animate-pulse flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-11/12 bg-white/10 rounded" />
            <div className="h-4 w-8/12 bg-white/10 rounded" />
            <div className="hidden lg:block h-10 w-40 bg-white/10 rounded" />
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="h-[220px] w-[220px] max-w-[70%] bg-white/10 rounded" />
          </div>

          <div className="lg:hidden flex justify-center">
            <div className="h-10 w-40 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Se não há banners para mostrar, não renderizar nada
  if (slidersToShow.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      spaceBetween={0}
      loop={slidersToShow.length > 1}  // Só ativar loop se há múltiplos slides
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      allowTouchMove={true}
  className="main-slider w-full bg-primary xl:bg-main-slider xl:bg-no-repeat max-w-lg lg:max-w-none rounded-[8px] overflow-hidden drop-shadow-2xl p-0"
    >
  {slidersToShow.map((slide, index) => {
        const isStaticBanner = slide.id === 'static-banner';
        
        // Função para renderizar conteúdo baseado no layout
        const renderBannerContent = () => {
          if (isStaticBanner) {
            // Banner estático mantém layout original
            return (
              <div className="flex flex-col items-center lg:flex-row h-full p-[20px] md:p-[60px]">
                <div className="w-full lg:flex-1 z-10 relative flex flex-col justify-center">
                  <div className="text-3xl md:text-[46px] font-semibold uppercase leading-none text-center lg:text-left mb-8 xl:mb-20">
                    {slide.title}
                  </div>
                  <div className="text-sm md:text-base text-center lg:text-left mb-8">
                    {slide.description}
                  </div>
                  {slide.link_url && slide.link_url !== '#' && (
                    <div className="hidden lg:flex justify-start">
                      <Link to={slide.link_url} className="button button-accent">
                        Compre agora
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <img
                    className="xl:absolute xl:-right-10 xl:-bottom-12"
                    src={slide.image_url || iphoneImg}
                    alt={slide.title}
                  />
                </div>
                {slide.link_url && slide.link_url !== '#' && (
                  <div className="flex justify-center lg:hidden mt-4">
                    <Link to={slide.link_url} className="button button-accent">
                      Compre agora
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          // Banners customizados com layouts
          const bannerLayout = slide.layout || 'left-content';
          
          // Componente de conteúdo de texto
          const TextContent = ({ className = "", textAlign = "text-center lg:text-left", showButton = true }) => (
            <div className={`flex flex-col justify-center ${className}`}>
              <div className={`text-2xl md:text-4xl font-semibold leading-tight ${textAlign} mb-4`}>
                {slide.title}
              </div>
              <div className={`text-sm md:text-base ${textAlign} mb-6`}>
                {slide.description}
              </div>
              {showButton && slide.link_url && slide.link_url !== '#' && (
                <div className={`hidden lg:flex ${
                  textAlign.includes('text-center') && !textAlign.includes('text-left') && !textAlign.includes('text-right') 
                    ? 'justify-center' 
                    : textAlign.includes('text-right') 
                      ? 'justify-end' 
                      : 'justify-start'
                }`}>
                  <Link to={slide.link_url} className="button button-accent">
                    Compre agora
                  </Link>
                </div>
              )}
            </div>
          );

          // Componente de imagem
          const ImageContent = ({ className = "" }) => (
            <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
              <img
                className="max-w-full max-h-full w-auto h-auto object-contain"
                src={slide.image_url || iphoneImg}
                alt={slide.title}
                style={{ maxHeight: '220px', maxWidth: '90%' }}
              />
            </div>
          );

          // Renderização baseada no layout
          switch (bannerLayout) {
            case 'right-content':
              return (
                <div className="flex flex-col lg:flex-row-reverse h-full p-[20px] md:p-[60px] items-center gap-6">
                  <TextContent className="w-full lg:flex-1" textAlign="text-center lg:text-right" />
                  <ImageContent className="flex-1 min-h-0" />
                  {slide.link_url && slide.link_url !== '#' && (
                    <div className="flex justify-center lg:hidden mt-4">
                      <Link to={slide.link_url} className="button button-accent">Compre agora</Link>
                    </div>
                  )}
                </div>
              );
              
            case 'center-content':
              return (
                <div className="flex flex-col h-full p-[20px] md:p-[60px] items-center justify-center text-center gap-6">
                  <div className="relative overflow-hidden flex items-center justify-center w-full max-w-sm max-h-[180px]">
                    <img
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      src={slide.image_url || iphoneImg}
                      alt={slide.title}
                      style={{ maxHeight: '180px', maxWidth: '100%' }}
                    />
                  </div>
                  <TextContent textAlign="text-center" showButton={false} />
                  {slide.link_url && slide.link_url !== '#' && (
                    <div className="flex justify-center mt-2">
                      <Link to={slide.link_url} className="button button-accent">Compre agora</Link>
                    </div>
                  )}
                </div>
              );
              
            case 'overlay-bottom':
              return (
                <div className="relative h-full overflow-hidden overlay-banner">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={slide.image_url || iphoneImg}
                    alt={slide.title}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-[1000] h-full flex flex-col justify-end overlay-banner__content p-[20px] md:p-[60px] text-white">
                    <TextContent textAlign="text-center lg:text-left" showButton={false} />
                    {slide.link_url && slide.link_url !== '#' && (
                      <div className="flex justify-center lg:justify-start mt-4">
                        <Link to={slide.link_url} className="button button-accent">Compre agora</Link>
                      </div>
                    )}
                  </div>
                </div>
              );
              
            case 'overlay-top':
              return (
                <div className="relative h-full overflow-hidden overlay-banner">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={slide.image_url || iphoneImg}
                    alt={slide.title}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-[1000] h-full flex flex-col justify-start overlay-banner__content p-[20px] md:p-[60px] text-white">
                    <TextContent textAlign="text-center lg:text-left" showButton={false} />
                    {slide.link_url && slide.link_url !== '#' && (
                      <div className="flex justify-center lg:justify-start mt-4">
                        <Link to={slide.link_url} className="button button-accent">Compre agora</Link>
                      </div>
                    )}
                  </div>
                </div>
              );
              
            case 'overlay-center':
              return (
                <div className="relative h-full overflow-hidden overlay-banner">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={slide.image_url || iphoneImg}
                    alt={slide.title}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-[1000] h-full flex flex-col justify-center items-center overlay-banner__content p-[20px] md:p-[60px] text-white text-center">
                    <TextContent textAlign="text-center" showButton={false} />
                    {slide.link_url && slide.link_url !== '#' && (
                      <div className="flex justify-center mt-4">
                        <Link to={slide.link_url} className="button button-accent">Compre agora</Link>
                      </div>
                    )}
                  </div>
                </div>
              );
              
            default: // 'left-content'
              return (
                <div className="flex flex-col lg:flex-row h-full p-[20px] md:p-[60px] items-center gap-6">
                  <TextContent className="w-full lg:flex-1" />
                  <ImageContent className="flex-1 min-h-0" />
                  {slide.link_url && slide.link_url !== '#' && (
                    <div className="flex justify-center lg:hidden mt-4">
                      <Link to={slide.link_url} className="button button-accent">Compre agora</Link>
                    </div>
                  )}
                </div>
              );
          }
        };

        const bannerLayout = (slide.layout || 'left-content') as string;
        const isOverlayBanner =
          !isStaticBanner &&
          (bannerLayout === 'overlay-bottom' ||
            bannerLayout === 'overlay-top' ||
            bannerLayout === 'overlay-center');

        return (
          <SwiperSlide
            key={slide.id || index}
            className={
              isStaticBanner
                ? 'slide-static-banner'
                : isOverlayBanner
                  ? 'slide-overlay-banner'
                  : 'slide-regular-banner'
            }
          >
            {renderBannerContent()}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
