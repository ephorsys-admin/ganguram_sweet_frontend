import { lazy } from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SweetPage from "../web/webPages/Sweetpage";
import AboutPage from "../web/webPages/Aboutpage";
import { Contact } from "lucide-react";
import ContactPage from "../web/webPages/Contatpage";
import GalleryPage from "../web/webPages/Gallerypage";

const HomePage = lazy(() => import("../web/webPages/HomePage"));
const NotFoundPage = lazy(() => import("../web/webPages/NotFoundPage"));

const PublicRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="menu" element={<SweetPage />} />
    <Route path="sweet" element={<SweetPage />} />
    <Route path ="about" element={<AboutPage />} />
    <Route path = "contact" element={<ContactPage/>}/>
    <Route path = "gallery" element={<GalleryPage/>}/>
    <Route path="*" element={<NotFoundPage />} />
    

   


  </Route>
);

export default PublicRoutes;
