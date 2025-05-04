import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Header from "../components/Header"; // pastikan path ini sesuai lokasi Header.jsx kamu
import Footer from "../components/Footer";
import PawTrip from "../components/Pawtrip";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("services").select("*");
      if (data) setServices(data);
      if (error) console.error("Error fetching services:", error);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleAddToCart = async (serviceId) => {
    if (!userId) {
      alert("Silakan login terlebih dahulu.");
      return;
    }
    const { error } = await supabase.from("cart").insert([
      { user_id: userId, service_id: serviceId, quantity: 1, type: "service" }
    ]);
    if (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      alert("Gagal menambahkan ke keranjang!");
    } else {
      alert("Layanan berhasil dimasukkan ke keranjang!");
    }
  };

  const bgImage = "/img/blog/Rectangle-70.png";  // ganti sesuai path gambarmu
  const title = "Services";
  const breadcrumb = [
    { label: "Home", link: "/" },
    { label: "Services" }
  ];

const backgroundStyle = { background: "white" };
  return (
    <div>
      {/* 🟧 Ini komponen Header */}
      <Header />

      <section
        className="relative w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay warna + blur */}
        <div className="absolute inset-0 bg-[#BDA697]/20 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-black text-4xl md:text-6xl font-bold mb-4">
            {title}
          </h1>
          <nav className="text-black text-base md:text-lg">
            {breadcrumb.map((item, idx) => (
              <span key={idx} className="inline-flex items-center">
                {item.link ? (
                  <a href={item.link} className="hover:underline">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
                {idx < breadcrumb.length - 1 && (
                  <span className="mx-2">&gt;</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </section>

      <div className=" items-start py-10 bg-white flex flex-col w-full mb-12" style={backgroundStyle}>
          <div className="container mx-auto p-6 max-w-7xl w-full bg-white">

            {/* Title */}
            <div className="flex flex-col mb-8">
              <h1 className="text-4xl font-extrabold text-[#5D4037]">
                Layanan Hewan
              </h1>
              <div className="w-full h-1 bg-[#4E3628] mt-2" />
            </div>
            

            {/* Content */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-[#6D4C41] border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="group relative bg-white rounded-2xl shadow-md border border-[#4E3628] overflow-hidden transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                    <div className="overflow-hidden">
                      <img src={service.image_url || "https://dummyimage.com/300x200/cccccc/ffffff&text=No+Image"} alt={service.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => e.target.src = "https://dummyimage.com/300x200/cccccc/ffffff&text=No+Image"}
                      />
                    </div>
                    <div className="pb-4 px-4">
                      <h2 className="mt-4 text-xl font-semibold text-[#6D4C41] group-hover:text-[#8D6E63] transition-colors">
                        {service.name}
                      </h2>
                      <p className="text-gray-600 mb-2">{service.description || "Layanan terbaik untuk hewan peliharaan Anda."}</p>
                      <p className="text-[#8D6E63] font-bold mb-4">Rp {service.price.toLocaleString("id-ID")}</p>
                      <button onClick={() => handleAddToCart(service.id)}
                        className="w-full bg-[#A1887F] hover:bg-[#8D6E63] text-white py-2 rounded-lg shadow-md ">
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default Services;
