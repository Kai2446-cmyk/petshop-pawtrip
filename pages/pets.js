import { useEffect, useState } from "react";
import { getPets } from "../lib/supabaseAPI";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { triggerChatWithMessage } from "../components/ChatWidget";
import { motion } from "framer-motion";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adoptingId, setAdoptingId] = useState(null);
  const [userAdoptedPetIds, setUserAdoptedPetIds] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
      } catch {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    const fetchUserAdoptions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("adoptions")
        .select("pet_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setUserAdoptedPetIds(data.map((item) => item.pet_id));
      }
    };

    fetchUserAdoptions();
  }, []);

  const handleAdopt = async (pet) => {
    if (!userId) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const confirmed = window.confirm(`Kamu yakin ingin mengadopsi ${pet.name}?`);
    if (!confirmed) return;

    setAdoptingId(pet.id);

    const { data: existing, error: checkError } = await supabase
      .from("adoptions")
      .select("*")
      .eq("user_id", userId)
      .eq("pet_id", pet.id);

    if (checkError) {
      console.error(checkError);
      alert("Terjadi kesalahan saat validasi.");
      setAdoptingId(null);
      return;
    }

    if (existing?.length > 0) {
      alert("Kamu sudah mengajukan adopsi untuk hewan ini.");
      setAdoptingId(null);
      return;
    }

    const { error } = await supabase.from("adoptions").insert([
      {
        user_id: userId,
        pet_id: pet.id,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Gagal mengadopsi.");
      setAdoptingId(null);
      return;
    }

    alert(`Berhasil mengajukan adopsi untuk ${pet.name}!`);
    setUserAdoptedPetIds((prev) => [...prev, pet.id]);

    // **Perbaikan:** kirim objek { text, imageUrl } (bukan string HTML)
    triggerChatWithMessage({
      text: `Saya mau mengadopsi ${pet.name}!`,
      imageUrl: pet.image_url,
    });

    setAdoptingId(null);
  };

  return (
    <>
      <Header />
      <section
        className="relative w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(/img/blog/Rectangle-70.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#BDA697]/20 backdrop-blur-sm" />
        <div className="relative z-10 px-4">
          <h1 className="text-black text-4xl md:text-6xl font-bold mb-4">Pets</h1>
          <nav className="text-black text-base md:text-lg">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            &gt; Pets
          </nav>
        </div>
      </section>

      <div className="p-8 py-16 min-h-screen bg-white flex flex-col items-center">
        <div className="container mx-auto p-6 max-w-7xl w-full bg-white/80 rounded-xl">
          <motion.div
            className="flex flex-col mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-extrabold text-[#4E3628] mb-1">
              🐾 Temukan Sahabat Barumu! 🐾
            </h1>
            <div className="w-full h-1 bg-[#4E3628] mt-2" />
          </motion.div>

          {loading && <div className="text-lg text-[#5D4037]">Memuat data pet...</div>}
          {error && <div className="text-lg text-red-600">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {pets.map((pet, index) => {
              const isUnavailable = !pet.available;
              const alreadyRequested = userAdoptedPetIds.includes(pet.id);

              return (
                <motion.div
                  key={pet.id}
                  className={`relative bg-white border border-[#4E3628] rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 ${
                    isUnavailable ? "opacity-50 pointer-events-none" : ""
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {isUnavailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl z-10">
                      Telah Diadopsi
                    </div>
                  )}

                  <div className="relative h-56">
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className={`w-full h-full object-cover rounded-t-3xl ${
                        isUnavailable ? "blur-sm" : ""
                      }`}
                    />
                    <div className="absolute top-2 left-2 bg-[#A1887F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {pet.category === "dog" ? "🐶 Anjing" : "🐱 Kucing"}
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <h2 className="text-2xl font-semibold text-[#5D4037]">{pet.name}</h2>
                    <p className="text-gray-600 text-lg font-medium mt-2">🐾 {pet.breed}</p>
                    <p className="text-gray-500 text-sm mt-1">📅 {pet.age} tahun</p>

                    {alreadyRequested && !isUnavailable && (
                      <div className="text-red-600 font-semibold mt-2">
                        Kamu sudah mengajukan adopsi untuk hewan ini
                      </div>
                    )}

                    <motion.button
                      onClick={() => handleAdopt(pet)}
                      disabled={isUnavailable || adoptingId === pet.id || alreadyRequested}
                      whileHover={{ scale: !isUnavailable ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mt-4 w-full text-lg px-5 py-3 rounded-xl transition font-semibold shadow-md ${
                        !isUnavailable && !alreadyRequested && adoptingId !== pet.id
                          ? "bg-[#A1887F] text-white hover:bg-[#8D6E63]"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      ❤️{" "}
                      {isUnavailable
                        ? "Tidak Tersedia"
                        : alreadyRequested
                        ? "Sudah Diajukan"
                        : adoptingId === pet.id
                        ? "Memproses..."
                        : `Adopsi ${pet.name} Sekarang!`}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
