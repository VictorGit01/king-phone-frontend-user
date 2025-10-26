import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../slider.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import iphoneImg from "../../assets/images/iphone-14.png";
import { useBanners, useSettings } from "../../hooks/useFetch";

export const MainSlider = () => {
  const { banners, loading, error } = useBanners();
  const { settings } = useSettings();

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

  if (loading) {
    return (
      <div className="main-slider h-full bg-primary rounded-[8px] overflow-hidden drop-shadow-2xl flex items-center justify-center">
        <p className="text-white">Carregando banners...</p>
      </div>
    );
  }

  // Se não há banners para mostrar, não renderizar o slider
  if (slidersToShow.length === 0) {
    return (
      <div className="main-slider h-full bg-gray-200 rounded-[8px] overflow-hidden drop-shadow-2xl flex items-center justify-center">
        <p className="text-gray-600">Nenhum banner ativo</p>
      </div>
    );
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
      autoplay={slidersToShow.length > 1 ? {
        delay: 3500,
        disableOnInteraction: false,
      } : false}  // Só ativar autoplay se há múltiplos slides
      allowTouchMove={true}
      className="main-slider h-full bg-primary xl:bg-main-slider xl:bg-no-repeat max-w-lg lg:max-w-none rounded-[8px] overflow-hidden drop-shadow-2xl"
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
                  <TextContent textAlign="text-center" />
                </div>
              );
              
            case 'overlay-bottom':
              return (
                <div className="relative h-full overflow-hidden">
                  <div className="absolute inset-0">
                    <img
                      className="w-full h-full object-cover"
                      src={slide.image_url || iphoneImg}
                      alt={slide.title}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-end p-[20px] md:p-[60px] text-white">
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
                <div className="relative h-full overflow-hidden">
                  <div className="absolute inset-0">
                    <img
                      className="w-full h-full object-cover"
                      src={slide.image_url || iphoneImg}
                      alt={slide.title}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-start p-[20px] md:p-[60px] text-white">
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
                <div className="relative h-full overflow-hidden">
                  <div className="absolute inset-0">
                    <img
                      className="w-full h-full object-cover"
                      src={slide.image_url || iphoneImg}
                      alt={slide.title}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-center items-center p-[20px] md:p-[60px] text-white text-center">
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

        return (
          <SwiperSlide key={slide.id || index}>
            {renderBannerContent()}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
