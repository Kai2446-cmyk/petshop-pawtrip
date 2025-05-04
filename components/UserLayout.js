// components/UserLayout.js
import UserSidebar from "./UserSidebar";
import ChatWidget from "./ChatWidget";

export default function UserLayout({ children }) {
  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen relative">
        {children}
        <ChatWidget />
      </main>
    </div>
  );
}
