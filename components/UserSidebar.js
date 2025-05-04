// components/UserSidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { User, Calendar, Settings, LogOut } from "lucide-react";

export default function UserSidebar() {
  const router = useRouter();

  const menu = [
    { label: "Profil", href: "/user/profile", icon: <User size={18} /> },
    { label: "Pesanan", href: "/user/riwayat", icon: <Calendar size={18} /> },
    { label: "Pengaturan", href: "/user/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-8">PawTrip</h1>
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                  router.pathname === item.href ? "bg-green-200 text-black font-semibold" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button
          onClick={() => router.push("/")}
          className="text-red-600 font-semibold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-md"
        >
          <LogOut size={18} />
          Kembali
        </button>
      </div>
    </div>
  );
}
