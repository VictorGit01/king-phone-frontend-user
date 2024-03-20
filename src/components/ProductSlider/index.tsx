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

export const ProductSlider = ({ data }: { data: Array<Product> }) => {
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
        1440: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      }}
      pagination={{
        clickable: true,
      }}
      // className="product-slider mx-auto max-w-[360px] md:max-w-lg xl:max-w-[1410px]"
      className="
        product-slider 
        mx-auto
        max-w-[360px]
        sm:max-w-sm
        md:max-w-[768px]
        lg:max-w-[1024px]
        xl:max-w-[1410px]
      "
    >
      {data?.map((product) => {
        return (
          <SwiperSlide key={product.id}>
            <Product product={product} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
