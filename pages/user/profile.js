// pages/user/profile.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import UserLayout from "../../components/UserLayout";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    };
    getProfile();
  }, []);

  return (
    <UserLayout>
      <div className="bg-green-200 p-10 rounded-t-xl">
      </div>
      <div className="bg-white p-6 rounded-b-xl shadow-md">
        <div className="flex items-center justify-between mb-4 mx-2">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar_url || "/default-avatar.png"}
              className="w-24 h-24 rounded-full border"
              alt="avatar"
            />
            <div>
              <h2 className="text-3xl font-bold">{profile?.full_name}</h2>
              <p className="text-gray-500">{profile?.email}</p>
            </div>
          </div>
          <button className="bg-blue-500 text-3xl text-white px-6 pb-2 pt-3 rounded-lg">Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-2 pb-2">
          <div>
            <label className="text-black text-xl">Nama</label>
            <div className="bg-gray-100 px-4 py-2 rounded-md text-lg">{profile?.full_name}</div>
          </div>
          <div>
            <label className="text-black text-xl">Jenis Kelamin</label>
            <div className="bg-gray-100 px-4 py-2 rounded-md text-lg">{profile?.gender || "-"}</div>
          </div>
          <div>
            <label className="text-black text-xl">Alamat</label>
            <div className="bg-gray-100 px-4 py-2 rounded-md text-lg">{profile?.alamat || "-"}</div>
          </div>
          <div>
            <label className="text-black text-xl">Nomor Telepon</label>
            <div className="bg-gray-100 px-4 py-2 rounded-md text-lg">{profile?.telepon || "-"}</div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
