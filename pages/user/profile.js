import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import UserLayout from "../../components/UserLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", gender: "", address: "", phone: "", email: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          gender: data.gender || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || user.email || "",
        });
      }
    };
    getProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        gender: form.gender,
        address: form.address,
        phone: form.phone,
        email: form.email,
      })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...form });
      setEditing(false);
    } else {
      alert("Gagal menyimpan perubahan profil.");
      console.error("Supabase Error:", error);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase
        .storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatar_url = publicUrl.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setProfile((prev) => ({ ...prev, avatar_url }));
    } catch (error) {
      alert("Gagal upload foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <UserLayout>
      <div className="bg-green-200 p-10 rounded-t-xl" />
      <div className="bg-white p-6 rounded-b-xl shadow-md">
        <div className="flex items-center justify-between mb-6 mx-2">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={profile?.avatar_url || "/default-avatar.png"}
                className="w-24 h-24 rounded-full border shadow-md object-cover"
                alt="avatar"
              />
              {editing && (
                <div className="absolute bottom-0 right-0 flex items-center justify-center">
                  <label className="cursor-pointer text-sm bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 shadow transition">
                    {uploading ? "Uploading..." : "Ganti"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{form.full_name}</h2>
              <p className="text-gray-500">{form.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-6 pb-2 pt-3 text-white text-lg font-semibold rounded-lg transition-all duration-300 ${
              editing ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editing ? "Batal" : "Edit Profil"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={editing ? "edit" : "view"}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mx-2 pb-2"
          >
            {["full_name", "gender", "address", "phone", "email"].map((field) => (
              <div key={field}>
                <label className="text-black text-xl capitalize">
                  {field === "full_name"
                    ? "Nama Lengkap"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {editing ? (
                  field === "gender" ? (
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="bg-gray-100 px-4 py-2 rounded-md text-lg w-full"
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="bg-gray-100 px-4 py-2 rounded-md text-lg w-full"
                    />
                  )
                ) : (
                  <div className="bg-gray-100 px-4 py-2 rounded-md text-lg">
                    {profile?.[field] || "-"}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {editing && (
          <div className="mt-6 mx-2 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all shadow"
            >
              Simpan Perubahan
            </motion.button>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
