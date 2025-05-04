import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(null);

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
        if (!userId) return;
        const { data, error } = await supabase
            .from("transaction")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }
        setTransactions(data);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
            {transactions.length === 0 ? (
                <p>Belum ada transaksi</p>
            ) : (
                <ul>
                    {transactions.map((tx) => (
                        <li key={tx.id} className="border p-2">
                            <span>Total: {tx.total_price}</span> |
                            <span> Status: {tx.status}</span> |
                            <span> Metode Pembayaran: {tx.payment_met}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
