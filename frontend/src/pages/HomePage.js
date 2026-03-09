import Hero from "../components/Hero";
import PropertySearch from "../components/PropertySearch";
import FeaturedProperties from "../components/FeaturedProperties";
import CategorySection from "../components/CategorySection";
import Gallery from "../components/Gallery";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  return (
    <main data-testid="home-page">
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <CategorySection />
      <Gallery />
      <WhyChooseUs />
      <ContactSection />
    </main>
  );
}
