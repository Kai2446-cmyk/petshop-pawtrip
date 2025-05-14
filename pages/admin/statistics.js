import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LabelList,
} from "recharts";

export default function Statistics() {
  const router = useRouter();
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Ambil semua transaksi "paid"
    const { data: transactions } = await supabase
      .from("transaction")
      .select("id, created_at, total_price, status")
      .eq("status", "paid");

    if (!transactions) return;

    const daily = {};
    const monthly = {};
    const todayTransactions = [];

    // Pisahkan transaksi hari ini dan sebelumnya
    transactions.forEach((t) => {
      const date = new Date(t.created_at);
      const dateStr = date.toISOString().split("T")[0];
      if (dateStr === todayStr) {
        daily[dateStr] = (daily[dateStr] || 0) + t.total_price;
        todayTransactions.push(t);
      } else {
        const monthStr = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        monthly[monthStr] = (monthly[monthStr] || 0) + t.total_price;
      }
    });

    const dailyResult = Object.entries(daily).map(([date, total]) => ({
      date,
      total,
    }));

    const monthlyResult = Object.entries(monthly).map(([month, total]) => ({
      month,
      total,
    }));

    // Ambil item dari transaksi hari ini
    const transactionIds = todayTransactions.map((t) => t.id);
    const { data: items } = await supabase
      .from("transaction_items")
      .select("product_id, service_id, quantity")
      .in("transaction_id", transactionIds);

    const itemMap = {};

    for (const item of items || []) {
      if (item.product_id) {
        const key = `product-${item.product_id}`;
        if (!itemMap[key]) {
          itemMap[key] = { id: item.product_id, type: "product", total: 0 };
        }
        itemMap[key].total += item.quantity;
      }

      if (item.service_id) {
        const key = `service-${item.service_id}`;
        if (!itemMap[key]) {
          itemMap[key] = { id: item.service_id, type: "service", total: 0 };
        }
        itemMap[key].total += item.quantity;
      }
    }

    const enrichedItems = [];

    for (const key in itemMap) {
      const { id, type, total } = itemMap[key];
      let name = "Tidak Diketahui";

      if (type === "product") {
        const { data } = await supabase
          .from("products")
          .select("name")
          .eq("id", id)
          .single();
        if (data) name = data.name;
      } else if (type === "service") {
        const { data } = await supabase
          .from("services")
          .select("name")
          .eq("id", id)
          .single();
        if (data) name = data.name;
      }

      enrichedItems.push({
        name,
        type,
        total,
      });
    }

    enrichedItems.sort((a, b) => b.total - a.total);

    setDailySales(dailyResult);
    setMonthlySales(monthlyResult);
    setTopItems(enrichedItems);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-600">
          📊 Statistik Penjualan
        </h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-yellow-600 hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Dashboard
        </button>
      </div>

      {/* Tabel Penjualan Harian */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📅 Penjualan Hari Ini
        </h2>
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-700">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map((sale, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{sale.date}</td>
                  <td className="p-3">Rp {sale.total.toLocaleString()}</td>
                </tr>
              ))}
              {dailySales.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={2}>
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Grafik Penjualan Harian */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📈 Grafik Penjualan Harian
        </h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#f59e0b" />
              <YAxis stroke="#f59e0b" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#f59e0b"
                name="Total Penjualan"
              >
                <LabelList dataKey="total" position="top" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Grafik Penjualan Bulanan */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📅 Grafik Penjualan Bulanan
        </h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#f59e0b" />
              <YAxis stroke="#f59e0b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#f59e0b" name="Total Penjualan">
                <LabelList dataKey="total" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Produk/Jasa Terlaris Hari Ini */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          🔥 Grafik Produk/Jasa Terlaris Hari Ini
        </h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#f59e0b" />
              <YAxis stroke="#f59e0b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#f59e0b" name="Jumlah Terjual">
                <LabelList dataKey="total" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tabel Produk/Jasa Terlaris */}
      <section className="mb-20">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📋 Produk / Jasa Terlaris Hari Ini
        </h2>
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-700">
              <tr>
                <th className="p-3">Nama Item</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Total Terjual</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 capitalize">{item.type}</td>
                  <td className="p-3">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
