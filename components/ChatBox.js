import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { ImagePlus } from "lucide-react";

export default function ChatBox({ userId, adminId, onClose, adminStatus }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messagesEndRef = useRef();

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
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chats" }, ({ new: m }) => {
        if (
          (m.sender_id === userId && m.receiver_id === adminId) ||
          (m.sender_id === adminId && m.receiver_id === userId)
        ) {
          setMessages(prev => [...prev, m]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, adminId]);

  // Mark messages as read setelah loading selesai
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!userId || !adminId) return;
      await supabase
        .from("chats")
        .update({ is_read: true })
        .eq("receiver_id", userId)
        .eq("sender_id", adminId)
        .eq("is_read", false);
    };

    if (!loading) {
      markMessagesAsRead();
    }
  }, [loading, userId, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() && !imageFile) return;

    let message = input.trim() || null;

    if (imageFile) {
      const fileName = `chat_images/${uuidv4()}.${imageFile.name.split(".").pop()}`;
      const { data, error } = await supabase.storage.from("bucketuser").upload(fileName, imageFile);

      if (error) {
        console.error("Upload error:", error.message);
        return;
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucketuser/${fileName}`;
      message = publicUrl;
    }

    const msg = {
      sender_id: userId,
      receiver_id: adminId,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, msg]);
    setInput("");
    setImageFile(null);
    setPreviewUrl(null);

    await supabase.from("chats").insert(msg);
  };

  const onFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  };

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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loading && <div className="text-center text-gray-400 mt-10">Loading...</div>}
        {!loading && messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[75%] text-sm ${
              m.sender_id === userId ? "bg-pink-100 ml-auto text-right" : "bg-white text-left"
            }`}
          >
            {m.message && isImageUrl(m.message) ? (
              <img
                src={m.message}
                className="mt-2 w-32 rounded"
                alt="Image"
              />
            ) : (
              m.message && <div>{m.message}</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview */}
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
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tulis pesan..."
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <label className="cursor-pointer px-2 border rounded-lg text-gray-600 hover:bg-gray-100">
          <ImagePlus size={18}/>
          <input type="file" className="hidden" accept="image/*" onChange={onFile}/>
        </label>
        <button onClick={send} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm">Kirim</button>
      </div>
    </div>
  );
}
