// pages/user/riwayat.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import UserLayout from "../../components/UserLayout";

export default function RiwayatPesanan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        setLoading(false);
        return;
      }

      // Ambil semua transaksi milik user, beserta items
      const { data, error } = await supabase
        .from("transaction")
        .select(`
          id,
          total_price,
          status,
          created_at,
          transaction_items (
            name,
            quantity,
            price
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch riwayat error:", error);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  return (
    <UserLayout>
      <h1 className="text-xl font-bold mb-6">Riwayat Pemesanan</h1>

      {loading ? (
        <p className="text-gray-600">Memuat...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">Belum ada riwayat pemesanan.</p>
      ) : (
        <div className="space-y-6">
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="p-4 border rounded-xl shadow-sm bg-white"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">
                  {new Date(trx.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`text-sm font-medium capitalize ${
                    trx.status === "paid"
                      ? "text-green-600"
                      : trx.status === "pending"
                      ? "text-yellow-600"
                      : trx.status === "canceled"
                      ? "text-red-600"
                      : trx.status === "selesai"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {trx.status === "canceled"
                    ? "Dibatalkan"
                    : trx.status === "selesai"
                    ? "Selesai"
                    : trx.status}
                </span>
              </div>

              <ul className="text-sm text-gray-700 mb-2 list-disc list-inside">
                {trx.transaction_items.map((item, idx) => (
                  <li key={idx} className="mb-1">
                    {item.quantity}x {item.name} – Rp{" "}
                    {item.price.toLocaleString("id-ID")}
                  </li>
                ))}
              </ul>

              <div className="text-right font-semibold text-black">
                Total: Rp {trx.total_price.toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
}
