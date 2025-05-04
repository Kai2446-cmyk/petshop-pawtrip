import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function AdminChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingStatus, setTypingStatus] = useState({});
  const router = useRouter();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminId(data.user.id);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch users and unread messages
  const fetchUsersWithMessages = async () => {
    const { data: chats } = await supabase.from("chats").select("*");
    const unread = {};
    const userIds = new Set();
    chats.forEach((c) => {
      if (c.sender_id !== adminId) {
        userIds.add(c.sender_id);
        if (c.receiver_id === adminId && c.is_read === false) {
          unread[c.sender_id] = (unread[c.sender_id] || 0) + 1;
        }
      }
    });
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, is_online")
      .in("id", Array.from(userIds));
    setUsers(profiles || []);
    setUnreadCounts(unread);
  };

  const markMessagesAsRead = async (userId) => {
    await supabase
      .from("chats")
      .update({ is_read: true })
      .eq("sender_id", userId)
      .eq("receiver_id", adminId)
      .eq("is_read", false);
    setUnreadCounts((prev) => {
      const p = { ...prev };
      delete p[userId];
      return p;
    });
  };

  const fetchMessages = async (userId) => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${adminId}),` +
        `and(sender_id.eq.${adminId},receiver_id.eq.${userId})`
      )
      .order("created_at", { ascending: true });
    setMessages(data || []);
    await markMessagesAsRead(userId);
    await fetchUsersWithMessages();
  };

  useEffect(() => {
    if (!adminId) return;
    fetchUsersWithMessages();

    // Subscribe to changes in the 'chats' table to update real-time
    const channel = supabase
      .channel("admin-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        ({ new: m }) => {
          // If the message is related to the selected user, update messages
          if (
            selectedUser &&
            (m.sender_id === selectedUser.id || m.receiver_id === selectedUser.id)
          ) {
            setMessages((prevMessages) => [...prevMessages, m]);
          }
          fetchUsersWithMessages();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chats" },
        () => {
          fetchUsersWithMessages();
        }
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        setTypingStatus((prev) => ({
          ...prev,
          [payload.payload.userId]: payload.payload.isTyping,
        }));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [adminId, selectedUser]);

  const handleUserClick = (u) => {
    setSelectedUser(u);
    fetchMessages(u.id);
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !imageFile) || !selectedUser) return;
    if (imageFile) {
      const fn = uuidv4() + "." + imageFile.name.split(".").pop();
      const fp = `chat_images_admin/${fn}`;
      await supabase.storage.from("bucketadmin").upload(fp, imageFile);
      const { data: urlData } = supabase.storage
        .from("bucketadmin")
        .getPublicUrl(fp);
      await supabase.from("chats").insert({
        sender_id: adminId,
        receiver_id: selectedUser.id,
        message: urlData.publicUrl,
        is_image: true,
        is_read: false,
      });
      setImageFile(null);
      setPreviewUrl(null);
      fetchMessages(selectedUser.id);
      return;
    }
    await supabase.from("chats").insert({
      sender_id: adminId,
      receiver_id: selectedUser.id,
      message: input.trim(),
      is_read: false,
    });
    setInput("");
    fetchMessages(selectedUser.id);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  // Render message - checking for image URLs
  const renderMessage = (msg) => {
    if (msg.message && /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(msg.message)) {
      return (
        <img
          src={msg.message}
          alt="Sent"
          className="rounded-lg max-w-full max-h-64 object-contain"
        />
      );
    }
    return msg.message;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 border-r p-4 bg-white overflow-y-auto shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">User</h2>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-sm px-3 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
        </div>
        {users.length === 0 && (
          <p className="text-gray-500">Belum ada pesan masuk.</p>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => handleUserClick(u)}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              selectedUser?.id === u.id ? "bg-orange-100" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <img
                src={u.avatar_url || "/default-avatar.png"}
                alt={u.full_name}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="font-medium">{u.full_name}</span>
            </div>
            {unreadCounts[u.id] > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                {unreadCounts[u.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col p-4">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedUser.avatar_url || "/default-avatar.png"}
                alt={selectedUser.full_name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <div className="font-semibold">{selectedUser.full_name}</div>
                <div className="text-xs text-gray-500">
                  {selectedUser.is_online ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
              {messages.map((msg) => {
                const isSender = msg.sender_id === adminId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-xl shadow text-sm ${
                        isSender
                          ? "bg-orange-100 text-right"
                          : "bg-gray-100 text-left"
                      }`}
                    >
                      {renderMessage(msg)}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-3 mt-4">  
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="p-2 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300"
              >
                <ImagePlus size={20} />
              </label>
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setImageFile(null);
                    }}
                    className="absolute top-0 right-0 text-white bg-gray-800 p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Ketik pesan..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-orange-500 text-white p-2 rounded-full"
              >
                Kirim
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Pilih pengguna untuk memulai chat
          </div>
        )}
      </div>
    </div>
  );
}
