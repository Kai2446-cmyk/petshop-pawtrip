// components/AdminNavbar.js
import Link from 'next/link';
import ChatWidget from './ChatWidget';

const AdminNavbar = () => {
  return (
    <>
      <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">PawTrip Admin</h1>
        <div className="flex gap-3 items-center">
          <Link
            href="/admin/chats"
            className="bg-gray-100 hover:bg-orange-100 text-orange-600 font-medium px-4 py-2 rounded-lg transition"
          >
            Pesan Masuk
          </Link>
          <Link
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Kembali ke Home
          </Link>
        </div>
      </header>
      <ChatWidget />
    </>
  );
};

export default AdminNavbar;
