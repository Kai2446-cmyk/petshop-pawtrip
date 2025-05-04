import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { LogOut, Settings, User, LayoutDashboard } from "lucide-react";

export default function DropdownProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (user) {
      // ✅ Update is_online ke false sebelum logout
      await supabase.from("profiles").update({ is_online: false }).eq("id", user.id);
    }

    await supabase.auth.signOut();
    router.push("/login");
  };

  const avatarUrl = profile?.avatar_url || "/default-avatar.png";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-12 h-12 rounded-full shadow-md object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-4 z-50 border border-gray-200">
          {/* Header */}
          <div className="flex items-center px-4 pb-3 border-b border-gray-200 gap-3">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-12 h-12 rounded-full border border-gray-300 object-cover"
            />
            <div>
              <div className="font-semibold text-sm text-gray-800">
                {profile?.full_name || "Hello, User"}
              </div>
              <div className="text-xs text-gray-500">@{profile?.username || "username"}</div>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="mt-2 text-sm">
            {profile?.role === "admin" && (
              <li
                onClick={() => router.push("/admin")}
                className="px-4 py-2 text-[18px] hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-black font-medium"
              >
                <LayoutDashboard size={24} />
                Dashboard
              </li>
            )}
            <li
              onClick={() => router.push("/user/profile")}
              className="px-4 py-2 text-[18px] hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-gray-700"
            >
              <User size={24} />
              Profile
            </li>
            <li
              onClick={() => router.push("/user/setting")}
              className="px-4 py-2 text-[18px] hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-gray-700"
            >
              <Settings size={24} />
              Settings
            </li>
            <li
              onClick={handleLogout}
              className="px-4 py-2 text-[18px] hover:bg-red-100 flex items-center gap-2 cursor-pointer text-red-600 font-medium"
            >
              <LogOut size={24} />
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
