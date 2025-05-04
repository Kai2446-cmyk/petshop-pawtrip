import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "./ChatBox";

export default function ChatWidget({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminStatus, setAdminStatus] = useState("offline");
  const senderId = user?.id;
  const boxRef = useRef();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, is_online")
      .eq("role", "admin")
      .single()
      .then(({ data }) => {
        if (data) {
          setAdminId(data.id);
          setAdminStatus(data.is_online ? "online" : "offline");
        }
      });
  }, []);

  const fetchUnreadCount = async () => {
    if (!senderId || !adminId) return;
    const { data } = await supabase
      .from("chats")
      .select("id")
      .eq("receiver_id", senderId)
      .eq("sender_id", adminId)
      .eq("is_read", false);
    setUnreadCount(data?.length || 0);
  };
  useEffect(() => { fetchUnreadCount(); }, [senderId, adminId]);

  const toggle = () => {
    setIsOpen(o => {
      const next = !o;
      if (!next) fetchUnreadCount(); // fetch lagi saat ditutup
      return next;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <motion.button
        onClick={toggle}
        initial={{ scale: 1 }}
        animate={{ scale: isOpen ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="bg-pink-600 p-4 rounded-full shadow-lg text-white relative"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-widget"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mt-2 origin-bottom-right"
          >
            <div
              ref={boxRef}
              className="bg-white w-80 max-w-[90vw] h-96 p-0 rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <ChatBox userId={senderId} adminId={adminId} onClose={toggle} adminStatus={adminStatus} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
