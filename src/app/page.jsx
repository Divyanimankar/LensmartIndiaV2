import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import { products } from "@/data/products";
import BeforeAfter from "@/components/BeforeAfter";
import TestimonialSlider from "@/components/TestimonialSlider";
import LatestBlogSlider from "@/components/LatestBlogSlider";
import "../styles/home.css";
import HeroSlider from "@/components/HeroSlider";
import BrandSlider from "@/components/BrandSlider";
import dailyLens from "../images/daily-lenses.png";
import weeklyLens from "../images/weekly-lenses.png";
import monthlyLens from "../images/monthly-lenses.png";
import ShopByCategory from "@/components/ShopByCategory";
import BestSellers from "@/components/BestSellers";
import PerfectShape from "@/components/PerfectShape";
import AboutUs from "../components/AboutUs";
import Perfectsunglasses from "../components/perfectsunglasses";
import ExclusiveDeals from "@/components/ExclusiveDeals";
import Faq from "@/components/Faq";
import ScrollToTop from "@/components/ScrollToTop";
import LensBestseller from "@/components/LensBestseller";
import FeatureSection from "@/components/FeatureSection";
import GlassesBrand from "@/components/GlassesBrand";

export const metadata = {
  title: "LensMartIndia - Contact Lenses Online",
  description:
    "Shop genuine contact lenses from trusted brands at LensMartIndia.",
};

export default function HomePage() {
  return (
    <div className="home-page">

      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <HeroSlider />

        {/* ==========================================
          fEATURE SECTION
      ========================================== */}
        <FeatureSection/>

      {/* ==========================================
          OUR PROMISE
      ========================================== */}

     <ShopByCategory />

      {/* ==========================================
          OUR BESTSELLERS
      ========================================== */}

      <BestSellers />

    

      {/* ==========================================
          PERFECT SHAPE - EYEGLASSES/Sunglasses
      ========================================== */}

     <PerfectShape />


        {/* ==========================================
          Exclusive Deals
      ========================================== */}

     <ExclusiveDeals />

      
      
        {/* ==========================================
          cONTACT LENSES BESTSELLERS
      ========================================== */}
        <LensBestseller />


      {/* ==========================================
          Glasses Brands
      ========================================== */}

     <GlassesBrand />

        

      {/* ==========================================
          BLOGS
      ========================================== */}

      {/* <LatestBlogSlider /> */}


      {/* ==========================================
          TESTIMONIALS
      ========================================== */}

      <TestimonialSlider />


      {/* ==========================================
          FAQ
      ========================================== */}

      <Faq />


  

    {/* ==========================================
          SCROLL TO TOP
      ========================================== */}

      <ScrollToTop />    
    </div>
  );
}