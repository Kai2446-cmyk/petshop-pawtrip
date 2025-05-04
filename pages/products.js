import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Cek user login
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Ambil data produk
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Tambah ke keranjang
  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      return;
    }

    const { error } = await supabase.from("cart").insert([
      {
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      },
    ]);

    if (error) {
      console.error("Gagal menambahkan ke cart:", error.message);
    } else {
      alert("Berhasil ditambahkan ke keranjang!");
    }
  };

  const bgImage = "/img/blog/Rectangle-70.png";  // ganti sesuai path gambarmu
  const title = "Products";
  const breadcrumb = [
    { label: "Home", link: "/" },
    { label: "Products" }
  ];

return (
  <div className="bg-white">
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

    <main className="flex-grow container mx-auto px-6 py-16 max-w-7xl">
      {/* Judul Halaman */}
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-bold text-[#6D4C41] animate-pulse text-center">
          Makanan Para Anabul 🐾
        </h1>
        <div className="w-full h-1 bg-[#4E3628] mt-2" />
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center text-gray-500">Memuat produk...</p>
        ) : products.length > 0 ? (
          products.map((product) => {
            const stockColor =
              product.stock <= 0
                ? "text-red-500"
                : product.stock <= 5
                ? "text-yellow-600"
                : "text-green-600";

            return (
              <div
                key={product.id}
                className="bg-[#f1eae5] rounded-2xl shadow-lg border border-[#4E3628] flex flex-col items-center hover:shadow-xl transition-all transform hover:scale-105"
              >
                <img
                  src={
                    product.image_url ||
                    "https://dummyimage.com/300x200/cccccc/ffffff&text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-t-2xl rounded-b-none mb-4"
                  onError={(e) => {
                    e.target.src =
                      "https://dummyimage.com/300x200/cccccc/ffffff&text=No+Image";
                  }}
                />
                <h2 className="text-xl font-bold text-[#5D4037] mb-2 text-center">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-center mb-2">
                  {product.description}
                </p>
                <p className="text-lg font-semibold text-[#8D6E63] mb-1">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                <p className={`font-medium ${stockColor}`}>
                  Stok: {product.stock > 0 ? product.stock : "Habis"}
                </p>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock <= 0}
                  className={`mt-4 mb-6 px-24 py-2 rounded-md text-white font-semibold shadow-md transition duration-200 ${
                    product.stock > 0
                      ? "bg-[#A1887F] hover:bg-[#8D6E63]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {product.stock > 0 ? "Beli Sekarang" : "Stok Habis"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Produk belum tersedia 🐶🐱
          </p>
        )}
      </div>
    </main>

    
    <Footer />
  </div>
  );
};

export default Products;
