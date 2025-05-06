import React, { useState } from "react";
import UserLayout from "../../components/UserLayout";
import { supabase } from "../../lib/supabase";

export default function UserSettings() {
  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggleForm = () => setShowChange((prev) => !prev);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!oldPassword) return alert("Masukkan password lama");
    if (newPassword !== confirmPassword) return alert("Password baru tidak cocok");

    setLoading(true);

    const { data: currentUser } = await supabase.auth.getUser();
    const email = currentUser?.user?.email;

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });

    if (loginError) {
      setLoading(false);
      return alert("Password lama salah");
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (error) {
      alert("Gagal mengubah password: " + error.message);
    } else {
      alert("Password berhasil diubah");
      setShowChange(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus akun Anda? Ini akan permanen.");
    if (!confirmDelete) return;

    const { data: currentUser, error: userError } = await supabase.auth.getUser();
    const userId = currentUser?.user?.id;

    if (userError || !userId) {
      return alert("Gagal mendapatkan data user");
    }

    try {
      // 1. Hapus dari tabel profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        console.error("Gagal hapus profil:", profileError.message);
        return alert("Gagal menghapus data profil.");
      }

      // 2. Logout user
      await supabase.auth.signOut();

      // 3. Info
      alert("Akun berhasil dihapus. Silakan hubungi admin jika ingin menghapus akun sepenuhnya.");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus akun.");
    }
  };

  return (
    <UserLayout active="settings">
      <div className="bg-white rounded-xl shadow-md">
        <div className="max-w-[1000px] p-6 space-y-6">
          {/* Password Field */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="password"
                value="••••••"
                readOnly
                className="flex-1 border border-gray-300 rounded px-4 py-2 bg-gray-100"
              />
              <button
                onClick={handleToggleForm}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ganti Password
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          {showChange && (
            <form onSubmit={handleSave}>
              <fieldset className="relative border border-gray-300 rounded-lg pt-6 px-6 pb-4">
                <legend className="absolute top-0 left-4 -mt-3 bg-white px-2 text-2xl font-semibold text-gray-800">
                  Ganti Password
                </legend>
                <div className="mx-4 my-4 space-y-6">
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xl font-medium mb-1">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xl font-medium mb-1">
                      Ulangi Password Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </fieldset>
            </form>
          )}

          {/* Delete Account */}
          <button
            onClick={handleDelete}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded"
          >
            Hapus Akun
          </button>
        </div>
      </div>
    </UserLayout>
  );
}
