import { lazy } from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProductDetails from "../web/web-components/Productdetails";
import CategoryListing from "../web/web-components/Categorylisting";
import AboutUs from "../web/webPages/AboutUs";

const HomePage = lazy(() => import("../web/webPages/HomePage"));
const Gallery = lazy(() => import("../web/webPages/Gallery"));
const Contact = lazy(() => import("../web/webPages/Contact"));
const PrivacyPolicy = lazy(() => import("../web/webPages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../web/webPages/TermsOfService"));

const PublicRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="/products" element={<OurSweets />} />
    <Route path="/products/:productId" element={<ProductDetails />} />
    <Route path="/category/:categoryId" element={<CategoryListing />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
  </Route>
);

export default PublicRoutes;

