import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import DropShowcase from "@/components/DropShowcase";
import BrandStatement from "@/components/BrandStatement";
import EmailCapture from "@/components/EmailCapture";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MaintenanceSplash from "@/components/MaintenanceSplash";
import { getProducts } from "@/lib/shopify";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const { maintenanceMode, maintenanceMessage } = await getSiteSettings();
  if (maintenanceMode) return <MaintenanceSplash message={maintenanceMessage} />;

  const { products, live } = await getProducts();

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <DropShowcase products={products} live={live} />
        <BrandStatement />
        <EmailCapture />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
