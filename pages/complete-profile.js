import { useState } from "react";
import { useRouter } from "next/router";
import { createProfile } from "../lib/profile";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    address: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let avatar_url = null;

    if (avatar) {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Gagal mendapatkan data pengguna.");
        setLoading(false);
        return;
      }

      const fileExt = avatar.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = fileName; // ✅ Perbaikan di sini

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar, {
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setError("Gagal mengunggah foto.");
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      avatar_url = publicUrl;
    }

    const { error: profileError } = await createProfile({
      ...form,
      avatar_url,
    });

    if (profileError) {
      console.error("Profile error:", profileError.message);
      setError("Gagal menyimpan profil. Coba lagi.");
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4"
      style={{
        background: "linear-gradient(to bottom right, #f3e5ab, #d7ccc8)",
      }}
    >
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <button className="bg-[#D7CCC8] hover:bg-[#BCAAA4] text-[#5D4037] font-semibold px-4 py-2 rounded-lg shadow transition transform hover:scale-105">
              ← Beranda
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-[#5D4037]">Lengkapi Profil</h1>
          <div className="w-10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Alamat</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Foto Profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7043] hover:bg-[#FF5722] text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            {loading ? "Menyimpan..." : "💾 Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
