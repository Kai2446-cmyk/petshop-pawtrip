// Import components
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Adoption from "./Adoption";
import ReviewsSection from "./review";
import Footer from "../components/Footer";
import CartPage from "./cart"; // ✅
import Link from "next/link";   // <— hanya ini
import WhyChooseUs from "../components/WhyChooseUs";
import Postingan from "../components/Postingan";




export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Anda telah logout!");
    router.push("/login");
  };

  return (
    <div>
      <Header />
      <Hero /> {/* ✅ Hero tetap ditampilkan */}
      <Services />
      <Adoption />
      <Postingan />
      <WhyChooseUs />
      <ReviewsSection />

      <Footer />
      <Link href="/history"></Link>
    </div>
  );
}
