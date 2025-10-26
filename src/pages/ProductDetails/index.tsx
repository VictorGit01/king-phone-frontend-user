import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { RelatedProducts } from "../../components/RelatedProducts";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";

import { useProduct } from "../../hooks/useFetch";
import { usePromotion } from "../../hooks/usePromotion";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

// 🆕 Usar o tipo IProduct do CartContext (remover a interface local)
// interface IProduct { ... } ❌ REMOVER ESTA INTERFACE

// Tipos locais
interface BackendFile {
  id: string;
  url: string;
  public_id: string;
}

interface BackendProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  color: string;
  quantity: number;
  price: number;
  details: string;
  files?: BackendFile[];
  created_at: string;
}

// 🆕 Função para converter produto do backend para o tipo do CartContext
const adaptBackendProductDetails = (backendProduct: BackendProduct) => {
  return {
    id: backendProduct.id,
    title: backendProduct.name, // name → title
    description: backendProduct.details, // details → description
    price: backendProduct.price,
    image_url: backendProduct.files?.[0]?.url || "/placeholder-image.jpg",
    category: backendProduct.category,
    category_id: backendProduct.category, // 🆕 Usar category como category_id
    is_new: true,
    amount: 1, // 🆕 Adicionar amount padrão
  };
};

export const ProductDetails = () => {
  const { addToCart, cart } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { id } = useParams();

  // Usar hook da API
  const { product: backendProduct, loading, error } = useProduct(id || "");
  
  // Hook para calcular promoções
  const promotion = usePromotion(id || "", backendProduct?.price || 0, backendProduct?.category);

  // Converter produto do backend
  const product = backendProduct
    ? adaptBackendProductDetails(backendProduct)
    : null;

  // Reset quantity when product changes
  useEffect(() => {
    setSelectedQuantity(1);
  }, [id]);

  // Functions to handle quantity
  const incrementQuantity = () => {
    if (backendProduct && selectedQuantity < backendProduct.quantity) {
      setSelectedQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && backendProduct) {
      // Check if adding this quantity would exceed stock
      const currentInCart = cart.find((item: any) => item.id === String(id))?.amount || 0;
      const totalAfterAdd = currentInCart + selectedQuantity;
      
      if (totalAfterAdd > backendProduct.quantity) {
        alert(`Você já tem ${currentInCart} unidades no carrinho. Máximo permitido: ${backendProduct.quantity} unidades`);
        return;
      }
      
      // ✅ SEMPRE usar o preço original - desconto é aplicado apenas na exibição
      addToCart(product, String(id), selectedQuantity);
      
      // 🎯 RESET do seletor de quantidade após adicionar ao carrinho
      setSelectedQuantity(1);
      
      console.log(`✅ Produto adicionado ao carrinho! Quantidade resetada para 1`);
    }
  };

  // Estado de erro
  if (error) {
    return (
      <div className="flex flex-col min-h-screen min-w-screen justify-center items-center">
        <p className="h2 text-red-500">Erro ao carregar produto</p>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // Estado de loading
  if (loading || !product) {
    return (
      <div className="flex flex-col min-h-screen min-w-screen justify-center items-center">
        <p className="h2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mb-16 pt-44 lg:pt-[30px] xl:pt-0">
      <div className="container mx-auto">
        {/* text */}
        <div className="flex flex-col lg:flex-row gap-[30px] mb-[30px]">
          <div className="flex-1 lg:max-w-[40%]">
            {/* Main Swiper */}
            <div className="grad rounded-lg overflow-hidden mb-4">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                spaceBetween={10}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="h-[400px]"
              >
                {backendProduct?.files && backendProduct.files.length > 0 ? (
                  backendProduct.files.map((file, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full h-full flex justify-center items-center p-6">
                        <img
                          src={file.url}
                          className="w-full max-w-[65%] h-auto object-contain max-h-full"
                          alt={`${product.title} - Imagem ${index + 1}`}
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="w-full h-full flex justify-center items-center p-6">
                      <img
                        src="/placeholder-image.jpg"
                        className="w-full max-w-[65%] h-auto object-contain max-h-full"
                        alt={product.title}
                      />
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Thumbnails Swiper */}
            {backendProduct?.files && backendProduct.files.length > 1 && (
              <div className="w-full">
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress
                  className="h-[120px] w-full"
                >
                  {backendProduct.files.map((file, index) => (
                    <SwiperSlide key={index}>
                      <div className="grad rounded-lg overflow-hidden cursor-pointer h-full">
                        <div className="w-full h-full flex justify-center items-center p-3">
                          <img
                            src={file.url}
                            className="w-full h-auto object-contain max-h-full"
                            alt={`${product.title} - Thumbnail ${index + 1}`}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
          <div className="flex-1 bg-primary p-12 xl:p-20 rounded-lg flex flex-col justify-center">
            {/* category title */}
            <div className="uppercase text-accent text-lg font-medium mb-2">
              {product.category}
            </div>
            {/* title */}
            <h2 className="h2 mb-4">{product.title}</h2>
            {/* description */}
            <p className="mb-8">{product.description}</p>
            
            {/* stock quantity */}
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Estoque:</span>
                <span 
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    backendProduct?.quantity === 0 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : backendProduct?.quantity && backendProduct.quantity <= 5
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}
                >
                  {backendProduct?.quantity === 0 
                    ? 'Esgotado' 
                    : backendProduct?.quantity === 1 
                    ? '1 unidade disponível'
                    : `${backendProduct?.quantity} unidades disponíveis`
                  }
                </span>
              </div>
            </div>

            {/* quantity selector */}
            <div className="mb-8">
              <span className="text-sm text-white mb-3 block">Quantidade:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    disabled={selectedQuantity <= 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 bg-gray-800 text-white min-w-[50px] text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={!backendProduct || selectedQuantity >= backendProduct.quantity}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  Máximo: {backendProduct?.quantity || 0}
                </span>
              </div>
            </div>

            {/* price & button */}
            <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-x-8">
              {/* price */}
              <div className="flex flex-col mb-5 md:mb-0">
                {promotion.hasDiscount ? (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-2xl text-accent font-semibold text-nowrap">
                        {formattedPrice(promotion.discountedPrice)}
                      </p>
                      <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded">
                        -{promotion.discountPercentage}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-through">
                      {formattedPrice(promotion.originalPrice)}
                    </p>
                    <p className="text-xs text-green-400">
                      Economize {formattedPrice(promotion.savings)}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl text-accent font-semibold text-nowrap">
                    {formattedPrice(product.price)}
                  </p>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={backendProduct?.quantity === 0}
                className={`button ${
                  backendProduct?.quantity === 0 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'button-accent'
                }`}
              >
                {backendProduct?.quantity === 0 
                  ? 'Produto Esgotado' 
                  : 'Adicionar ao carrinho'
                }
              </button>
            </div>
          </div>
        </div>
        <RelatedProducts category={product.category} currentProductId={String(id)} />
      </div>
    </div>
  );
};
