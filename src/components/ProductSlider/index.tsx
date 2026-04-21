import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../slider.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import { Product } from "../../components/Product";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_new: boolean;
}

export const ProductSlider = ({
  data,
  latestProducts,
}: {
  data: Array<Product>;
  latestProducts?: boolean;
}) => {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      loop={false}
      navigation={true}
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1360: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
        1440: {
          // Evita que os cards fiquem menores em telas grandes
          // (com 6+ cards por view, o Swiper reduz demais o width de cada slide)
          slidesPerView: 5,
          spaceBetween: 30,
        },
      }}
      pagination={{
        clickable: true,
      }}
  className="product-slider w-full max-w-full overflow-hidden"
    >
      {data?.map((product) => {
        if (latestProducts && !product.is_new) {
          return;
        }
        return (
          <SwiperSlide key={product.id}>
            <Product product={product} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
