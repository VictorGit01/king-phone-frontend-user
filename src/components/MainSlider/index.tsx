import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../slider.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import iphoneImg from "../../assets/images/iphone-14.png";

const sliderData = [
  {
    img: iphoneImg,
    pretitle: "Oferta Especial",
    title_part_1: "Economize 20%",
    title_part_2: "em seu",
    title_part_3: "primeiro pedido",
    button_text: "Compre agora",
  },
  {
    img: iphoneImg,
    pretitle: "Oferta Especial",
    title_part_1: "Economize 20%",
    title_part_2: "em seu",
    title_part_3: "primeiro pedido",
    button_text: "Compre agora",
  },
  {
    img: iphoneImg,
    pretitle: "Oferta Especial",
    title_part_1: "Economize 20%",
    title_part_2: "em seu",
    title_part_3: "primeiro pedido",
    button_text: "Compre agora",
  },
];

export const MainSlider = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      loop={true}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      // className="
      //   main-slider
      //   mx-auto
      //   max-w-[360px]
      //   sm:max-w-sm
      //   md:max-w-[768px]
      //   lg:max-w-[1024px]
      //   xl:max-w-[1410px]
      // "
      className="main-slider h-full bg-primary xl:bg-main-slider xl:bg-no-repeat max-w-lg lg:max-w-none rounded-[8px] overflow-hidden drop-shadow-2xl"
    >
      {sliderData.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col items-center lg:flex-row h-full p-[20px] md:p-[60px]">
            {/* text */}
            <div className="w-full lg:flex-1">
              <div className="uppercase mb-1 text-center lg:text-left">
                {slide.pretitle}
              </div>
              <div className="text-3xl md:text-[46px] font-semibold uppercase leading-none text-center lg:text-left mb-8 xl:mb-20">
                {slide.title_part_1} <br />
                {slide.title_part_2} <br />
                {slide.title_part_3}
              </div>
              <button className="button button-accent mx-auto lg:mx-0">
                Compre agora
              </button>
            </div>
            {/* img */}
            <div className="flex-1">
              <img
                // className="xl:absolute xl:-right-16 xl:-bottom-12"
                className="xl:absolute xl:-right-10 xl:-bottom-12"
                src={slide.img}
                alt=""
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
