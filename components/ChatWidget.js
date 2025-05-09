// components/ChatWidget.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "./ChatBox";

let openChatFromOutside = null;

export default function ChatWidget() {
  const [sessionUser, setSessionUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [adminStatus, setAdminStatus] = useState("offline");
  const [unreadCount, setUnreadCount] = useState(0);

  // ambil user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setSessionUser(data.user);
    });
  }, []);
  const senderId = sessionUser?.id;

  // ambil admin
  useEffect(() => {
    if (!senderId) return;
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
  }, [senderId]);

  // hitung unread
  useEffect(() => {
    if (!senderId || !adminId) return;
    supabase
      .from("chats")
      .select("id")
      .eq("receiver_id", senderId)
      .eq("sender_id", adminId)
      .eq("is_read", false)
      .then(({ data }) => setUnreadCount(data.length));
  }, [senderId, adminId]);

  // tandai pesan sebagai dibaca saat membuka chat
  useEffect(() => {
    if (isOpen && senderId && adminId) {
      supabase
        .from("chats")
        .update({ is_read: true })
        .eq("receiver_id", senderId)
        .eq("sender_id", adminId)
        .eq("is_read", false)
        .then(() => {
          setUnreadCount(0);
        });
    }
  }, [isOpen, senderId, adminId]);

  // toggle buka chat
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  // buat global trigger
  useEffect(() => {
    openChatFromOutside = async ({ text, imageUrl }) => {
      if (!senderId || !adminId) return;
      const now = new Date().toISOString();
      const html = imageUrl
        ? `${text}<br/><img src="${imageUrl}" style="max-width:100%;border-radius:8px;margin-top:5px;"/>`
        : text;
      await supabase.from("chats").insert({
        sender_id: senderId,
        receiver_id: adminId,
        message: html,
        is_read: false,
        created_at: now,
      });
      setIsOpen(true);
    };
    return () => {
      openChatFromOutside = null;
    };
  }, [senderId, adminId]);

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
            <div className="bg-white w-80 max-w-[90vw] h-96 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <ChatBox
                userId={senderId}
                adminId={adminId}
                onClose={toggle}
                adminStatus={adminStatus}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// export fungsi global
export function triggerChatWithMessage(messageObj) {
  if (openChatFromOutside) openChatFromOutside(messageObj);
}
