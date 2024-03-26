import { CategoryNav } from "../CategoryNav";
import { MainSlider } from "../MainSlider";

import promoImg1 from "../../assets/images/iphone-13-pro.png";
import promoImg2 from "../../assets/images/jbl-xtreme.png";

export const Hero = () => {
  return (
    <section className="mb-[30px] pt-36 lg:pt-0">
      <div className="container mx-auto">
        <div className="flex flex-col gap-y-[30px] xl:flex-row xl:gap-x-[30px]">
          {/* sidebar */}
          <div>
            <CategoryNav />
          </div>
          {/* main slider */}
          <div className="w-full max-w-lg lg:max-w-[734px] mx-auto">
            <MainSlider />
          </div>
          {/* promo */}
          <div className="flex flex-col gap-y-[30px] w-full max-w-lg mx-auto h-[500px]">
            {/* promo 1 */}
            <div className="grad flex-1 h-[250px] rounded-[8px] overflow-hidden relative p-6">
              {/* text */}
              <div className="flex flex-col max-w-[144px] h-full justify-center">
                <div className="text-[20px] uppercase font-medium leading-tight mb-4">
                  Economize 10% em todas as linhas de iPhones 13 e 13 Pro.
                </div>
                <a href="#" className="uppercase text-accent">
                  Pedir agora
                </a>
              </div>
              {/* img */}
              <img
                className="max-h-[150px] xl:max-h-[80px] absolute z-20 top-10 xl:top-[140px] right-5 xl:right-0"
                src={promoImg1}
                alt=""
              />
            </div>

            {/* promo 2 */}
            <div className="grad flex-1 h-[250px] rounded-[8px] overflow-hidden relative p-6">
              {/* text */}
              <div className="flex flex-col max-w-[144px] h-full justify-center">
                <div className="text-[20px] uppercase font-medium leading-tight mb-4">
                  Todas as JBLs com 15% de desconto.
                </div>
                <a href="#" className="uppercase text-accent">
                  Pedir agora
                </a>
              </div>
              {/* img */}
              <img
                className="max-h-[150px] xl:max-h-[80px] absolute z-20 top-10 xl:top-[130px] -right-8 xl:-right-12"
                src={promoImg2}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
