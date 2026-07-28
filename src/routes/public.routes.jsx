import { lazy } from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProductDetails from "../web/web-components/Productdetails";
import CategoryListing from "../web/web-components/Categorylisting";
import AboutUs from "../web/webPages/AboutUs";
// import { Contact } from "lucide-react";

const HomePage = lazy(() => import("../web/webPages/HomePage"));
const OurSweets = lazy(() => import("../web/webPages/OurSweets"));

const PublicRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="/products" element={<OurSweets />} />
    <Route path="/products/:productId" element={<ProductDetails />} />
    <Route path="/category/:categoryId" element={<CategoryListing />} />
    <Route path="/about" element={<AboutUs />} />
  </Route>
);

export default PublicRoutes;
