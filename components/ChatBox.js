// components/ChatBox.js
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { ImagePlus } from "lucide-react";

export default function ChatBox({
  userId,
  adminId,
  onClose,
  adminStatus,
  initialMessage,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messagesEndRef = useRef();
  const hasSentInitial = useRef(false);

  // helper: format timestamp HH:MM
  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Load & subscribe messages
  useEffect(() => {
    if (!userId || !adminId) return;

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chats")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${adminId}),` +
          `and(sender_id.eq.${adminId},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });
      setMessages(data || []);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("chat-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        ({ new: m }) => {
          if (
            (m.sender_id === userId && m.receiver_id === adminId) ||
            (m.sender_id === adminId && m.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, m]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, adminId]);

  // Mark as read on load
  useEffect(() => {
    if (!loading && userId && adminId) {
      supabase
        .from("chats")
        .update({ is_read: true })
        .eq("receiver_id", userId)
        .eq("sender_id", adminId)
        .eq("is_read", false);
    }
  }, [loading, userId, adminId]);

  // Scroll down tiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper upload gambar
  const uploadImage = useCallback(async (file) => {
    const ext = file.name.split(".").pop();
    const fname = `chat_images/${uuidv4()}.${ext}`;
    const { error } = await supabase.storage
      .from("bucketuser")
      .upload(fname, file);
    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucketuser/${fname}`;
  }, []);

  // Send (bisa text-only, image-only, atau gabungan)
  const send = useCallback(
    async ({ text = "", imageUrl = null } = {}) => {
      const now = new Date().toISOString();

      // Gabung menjadi HTML jika keduanya ada
      if (text && imageUrl) {
        const html = `${text}<br/><img src="${imageUrl}" style="max-width:100%;border-radius:8px;margin-top:5px;"/>`;
        const msg = {
          sender_id: userId,
          receiver_id: adminId,
          message: html,
          is_read: false,
          created_at: now,
        };
        setMessages((p) => [...p, msg]);
        await supabase.from("chats").insert(msg);
      } else {
        if (text) {
          const msgText = {
            sender_id: userId,
            receiver_id: adminId,
            message: text,
            is_read: false,
            created_at: now,
          };
          setMessages((p) => [...p, msgText]);
          await supabase.from("chats").insert(msgText);
        }
        if (imageUrl) {
          const msgImg = {
            sender_id: userId,
            receiver_id: adminId,
            message: imageUrl,
            is_read: false,
            created_at: now,
          };
          setMessages((p) => [...p, msgImg]);
          await supabase.from("chats").insert(msgImg);
        }
      }

      setInput("");
      setImageFile(null);
      setPreviewUrl(null);
    },
    [userId, adminId]
  );

  // Kirim initialMessage saat ChatBox mount
  useEffect(() => {
    if (initialMessage && !hasSentInitial.current && !loading) {
      send(initialMessage);
      hasSentInitial.current = true;
    }
  }, [initialMessage, loading, send]);

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith("image/")) {
      return alert("File harus gambar");
    }
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };
  const onManualSend = async () => {
    let url = null;
    if (imageFile) url = await uploadImage(imageFile);
    await send({ text: input.trim(), imageUrl: url });
  };

  const isImageUrl = (u) => /\.(jpeg|jpg|gif|png|webp)$/i.test(u);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">🐾</div>
          <div>
            <h3 className="font-semibold text-lg text-pink-600">Kontak Admin</h3>
            <p className={`text-xs ${adminStatus === "online" ? "text-green-500" : "text-gray-400"}`}>
              {adminStatus === "online" ? "Admin Online" : "Admin Offline"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg">✖</button>
      </div>

      {/* Pesan */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
        {loading && <div className="text-center text-gray-400 mt-10">Loading...</div>}
        {!loading && messages.map((m, i) => {
          const img = isImageUrl(m.message);
          const html = /<\/?[a-z][\s\S]*>/i.test(m.message);
          const time = formatTime(m.created_at);
          return (
            <div
              key={m.id || i}
              className={`p-2 rounded-lg max-w-[75%] text-sm ${
                m.sender_id === userId ? "bg-pink-100 ml-auto text-right" : "bg-white text-left"
              }`}
            >
              {html ? (
                <div dangerouslySetInnerHTML={{ __html: m.message }} />
              ) : img ? (
                <img src={m.message} className="mt-2 w-32 rounded" alt="img" />
              ) : (
                <div>{m.message}</div>
              )}
              <div className="text-xs text-gray-400 mt-1 text-right">{time}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview Upload */}
      {previewUrl && (
        <div className="p-2">
          <img src={previewUrl} className="w-24 h-24 object-cover rounded mx-auto" alt="preview" />
        </div>
      )}

      {/* Input */}
      <div className="flex items-center p-4 border-t gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Tulis pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onManualSend()}
        />
        <label className="cursor-pointer px-2 border rounded-lg text-gray-600 hover:bg-gray-100">
          <ImagePlus size={18} />
          <input type="file" className="hidden" accept="image/*" onChange={onFile} />
        </label>
        <button onClick={onManualSend} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm">
          Kirim
        </button>
      </div>
    </div>
  );
}
