import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TransactionPage() {
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(null); // Gunakan state untuk user_id

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                fetchTransactions(user.id);
            }
        };
        fetchUser();
    }, []);

    const fetchTransactions = async (userId) => {
        if (!userId) return; // Hindari request jika userId masih null

        const { data, error } = await supabase
            .from("transaction")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }
        setTransactions(data);
    };

    // ✅ Tambahkan fungsi untuk menyimpan transaksi baru
    const createTransaction = async () => {
        if (!userId) {
            console.error("User belum login!");
            return;
        }

        const newTransaction = {
            user_id: userId,
            total_price: 10000, // Pastikan tidak NULL, bisa ambil dari input
            status: "pending",
            payment_met: "COD" // Bisa diubah sesuai metode pembayaran
        };

        const { data, error } = await supabase.from("transaction").insert([newTransaction]);

        if (error) {
            console.error("Gagal menambahkan transaksi:", error);
        } else {
            console.log("Transaksi berhasil ditambahkan:", data);
            fetchTransactions(userId); // Refresh transaksi setelah insert
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Transactions</h1>

            {/* ✅ Tambahkan tombol untuk membuat transaksi baru */}
            <button onClick={createTransaction} className="bg-blue-500 text-white p-2 rounded">
                Tambah Transaksi
            </button>

            {transactions.length === 0 ? (
                <p>Tidak ada transaksi</p>
            ) : (
                <ul>
                    {transactions.map((tx) => (
                        <li key={tx.id} className="border p-2">
                            <span>Produk ID: {tx.product_id || "N/A"}</span> |
                            <span> Jasa ID: {tx.service_id || "N/A"}</span> |
                            <span> Total: {tx.total_price || "0"}</span> | {/* Pastikan total_price ada */}
                            <span> Status: {tx.status}</span> |
                            <span> Metode: {tx.payment_met || "N/A"}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
