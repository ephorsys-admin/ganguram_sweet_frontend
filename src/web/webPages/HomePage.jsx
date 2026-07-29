import HomeCarousel from "../web-components/HomeCarousel"
import OurBestselling from "../web-components/OurBestselling"
import ShopByCategory from "../web-components/ShopByCategory"
import WhyChooseUs from "../web-components/WhyChooseUs"
import FaqSection from "../web-components/FaqSection"

const HomePage = () => {
  return (
    <div>
      <HomeCarousel />
      <ShopByCategory />
      <OurBestselling />
      <WhyChooseUs />
      <FaqSection />
    </div>
  )
}

export default HomePage