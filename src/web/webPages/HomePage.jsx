import HomeCarousel from "../web-components/HomeCarousel"
import OurBestselling from "../web-components/OurBestselling"
import ShopByCategory from "../web-components/ShopByCategory"

const HomePage = () => {
  return (
    <div>
      <HomeCarousel />
      <ShopByCategory />
      <OurBestselling />
    </div>
  )
}

export default HomePage