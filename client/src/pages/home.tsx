import { Helmet } from "react-helmet";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedTours from "@/components/home/FeaturedTours";
import HowItWorks from "@/components/home/HowItWorks";
import CustomTravelRequest from "@/components/home/CustomTravelRequest";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Maroc Voyages - Découvrez les Merveilles du Maroc</title>
        <meta
          name="description"
          content="Explorez le Maroc avec nos voyages organisés personnalisés. Découvrez des destinations authentiques, l'artisanat local et vivez une expérience inoubliable."
        />
      </Helmet>
      
      <Hero />
      <Categories />
      <FeaturedTours />
      <HowItWorks />
      <CustomTravelRequest />
      <FeaturedProducts />
      <Testimonials />
      <BlogSection />
    </>
  );
};

export default Home;
