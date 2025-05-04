import React, { useState } from "react";
import UserLayout from "../../components/UserLayout";

export default function UserSettings() {
  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggleForm = () => {
    setShowChange((prev) => !prev);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!oldPassword) {
      return alert("Masukkan password lama");
    }
    if (newPassword !== confirmPassword) {
      return alert("Password baru tidak cocok");
    }
    // TODO: panggil API ganti password di sini
    alert("Password berhasil diubah (simulasi)");
    setShowChange(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDelete = () => {
    if (!confirm("Anda yakin ingin menghapus akun? Data tidak bisa dikembalikan.")) return;
    // TODO: panggil API hapus akun di sini
    alert("Akun dihapus (simulasi)");
    window.location.href = "/login";
  };

  return (
    <UserLayout active="settings">
      <div className="bg-white rounded-xl shadow-md">
        <div className="max-w-[1000px] p-6 space-y-6">
          {/* Current password display + toggle button */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="password"
                value="•••••"
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

          {/* Change password form */}
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
                    className="px-6 py-2 bg-blue-600 text-white rounded"
                  >
                    Simpan
                  </button>
                </div>
              </fieldset>
            </form>
          )}

          {/* Delete account */}
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
