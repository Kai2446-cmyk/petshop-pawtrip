import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { ArrowLeft } from "lucide-react";

// Import komponen‐komponen Recharts
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

// Import React Calendar untuk kalender
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Statistics() {
  const router = useRouter();

  // STATE UTAMA
  const [dailySales, setDailySales] = useState([]);              // Semua data harian: [{ date, total }, …]
  const [filteredDailySales, setFilteredDailySales] = useState([]); // Data harian terfilter (filter by selectedDate)
  const [monthlySales, setMonthlySales] = useState([]);          // Semua data bulanan: [{ month, total }, …]
  const [filteredMonthlySales, setFilteredMonthlySales] = useState([]); // Data bulanan terfilter (filter by selectedDate)
  const [topItems, setTopItems] = useState([]);                  // Data produk/jasa terlaris hari ini: [{ name, type, total }, …]
  const [salesDates, setSalesDates] = useState(new Set());       // Kumpulan tanggal (YYYY-MM-DD) yang ada transaksi
  const [selectedDate, setSelectedDate] = useState(null);        // Date yang dipilih di kalender

  // Ambil statistik saat komponen mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fungsi mengambil data dari Supabase
  const fetchStatistics = useCallback(async () => {
    // 1) Ambil semua transaksi 'paid'
    const { data: transactions, error: txError } = await supabase
      .from("transaction")
      .select("id, created_at, total_price, status")
      .eq("status", "paid");

    if (txError || !transactions) {
      console.error("Error fetching transactions:", txError);
      return;
    }

    // 2) Hitung total harian dan bulanan, serta kumpulkan semua tanggal
    const dailyMap = {};
    const monthlyMap = {};
    const datesSet = new Set();
    const todayStr = new Date().toISOString().split("T")[0];
    const todayTransactions = [];

    transactions.forEach((t) => {
      const d = new Date(t.created_at);
      const dateStr = d.toISOString().split("T")[0];
      datesSet.add(dateStr);

      // Tambahkan total_price ke hari itu
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + t.total_price;

      // Tambahkan total_price ke bulan itu (YYYY-MM)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + t.total_price;

      // Simpan transaksi hari ini untuk hitung produk terlaris
      if (dateStr === todayStr) {
        todayTransactions.push(t);
      }
    });

    // 3) Susun array dailySales berurutan berdasarkan tanggal
    const dailyResult = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({ date, total }));

    // 4) Susun array monthlySales berurutan berdasarkan bulan
    const monthlyResult = Object.entries(monthlyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, total]) => ({ month, total }));

    // 5) Hitung produk/jasa terlaris hari ini
    const txIds = todayTransactions.map((t) => t.id);
    let itemsData = [];
    if (txIds.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from("transaction_items")
        .select("product_id, service_id, quantity")
        .in("transaction_id", txIds);
      if (!itemsError && items) {
        itemsData = items;
      }
    }

    const itemMap = {};
    itemsData.forEach((it) => {
      if (it.product_id) {
        const key = `product-${it.product_id}`;
        if (!itemMap[key]) {
          itemMap[key] = { id: it.product_id, type: "product", total: 0 };
        }
        itemMap[key].total += it.quantity;
      }
      if (it.service_id) {
        const key = `service-${it.service_id}`;
        if (!itemMap[key]) {
          itemMap[key] = { id: it.service_id, type: "service", total: 0 };
        }
        itemMap[key].total += it.quantity;
      }
    });

    // Ambil nama produk/jasa dari tabel
    const enriched = [];
    for (const key in itemMap) {
      const { id, type, total } = itemMap[key];
      let name = "Tidak Diketahui";
      if (type === "product") {
        const { data: pData, error: pErr } = await supabase
          .from("products")
          .select("name")
          .eq("id", id)
          .single();
        if (!pErr && pData) name = pData.name;
      } else {
        const { data: sData, error: sErr } = await supabase
          .from("services")
          .select("name")
          .eq("id", id)
          .single();
        if (!sErr && sData) name = sData.name;
      }
      enriched.push({ name, type, total });
    }
    enriched.sort((a, b) => b.total - a.total);

    // 6) Set semua state
    setDailySales(dailyResult);
    setFilteredDailySales(dailyResult);         // default menampilkan semua harian
    setMonthlySales(monthlyResult);
    setFilteredMonthlySales(monthlyResult);     // default menampilkan semua bulanan
    setTopItems(enriched);
    setSalesDates(datesSet);
  }, []);

  // Ketika user klik tanggal di kalender
  const handleDateChange = (dateObj) => {
    setSelectedDate(dateObj);
    const dateStr = dateObj.toISOString().split("T")[0];   // "YYYY-MM-DD"
    const monthKey = dateStr.slice(0, 7);                   // "YYYY-MM"

    // Filter harian berdasarkan tanggal yang dipilih
    setFilteredDailySales(dailySales.filter((it) => it.date === dateStr));
    // Filter bulanan berdasarkan bulan yang dipilih
    setFilteredMonthlySales(monthlySales.filter((it) => it.month === monthKey));
  };

  // Kembali ke halaman Admin Dashboard
  const goBack = () => {
    router.push("/admin");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ===== Header & Tombol Kembali ===== */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-600">
          📊 Statistik Penjualan
        </h1>
        <button
          onClick={goBack}
          className="text-yellow-600 hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Dashboard
        </button>
      </div>

      {/* ===== 1) Kalender Penjualan ===== */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📅 Kalender Penjualan
        </h2>
        <div className="bg-white p-4 rounded-lg shadow max-w-md">
          <Calendar
            onClickDay={handleDateChange}
            tileContent={({ date, view }) => {
              const ds = date.toISOString().split("T")[0];
              return salesDates.has(ds) ? (
                <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-yellow-500"></div>
              ) : null;
            }}
            tileClassName={({ date, view }) => {
              if (view === "month") {
                const ds = date.toISOString().split("T")[0];
                return salesDates.has(ds) ? "bg-yellow-50" : null;
              }
              return null;
            }}
          />
        </div>
        {selectedDate && (
          <div className="mt-4 text-sm text-gray-700">
            Menampilkan data untuk tanggal:{" "}
            <span className="font-semibold">
              {selectedDate.toISOString().split("T")[0]}
            </span>{" "}
            (Bulan:{" "}
            <span className="font-semibold">
              {selectedDate.toISOString().split("T")[0].slice(0, 7)}
            </span>
            )
          </div>
        )}
      </section>

      {/* ===== 2) Tabel + Grafik Penjualan Harian (AreaChart) ===== */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📅 Penjualan Harian
        </h2>

        {/* – Tabel Harian */}
        <div className="bg-white rounded-lg overflow-hidden shadow mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-700">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {filteredDailySales.map((sale, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{sale.date}</td>
                  <td className="p-3">
                    Rp {sale.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              {filteredDailySales.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={2}>
                    {!selectedDate
                      ? "Tidak ada data"
                      : `Tidak ada transaksi pada tanggal ${selectedDate
                          .toISOString()
                          .split("T")[0]}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* – Grafik Harian (AreaChart dengan shading) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={filteredDailySales}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              {/* Grid halus */}
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />

              {/* Sumbu X (tanggal), dimiringkan supaya tidak bertumpuk */}
              <XAxis
                dataKey="date"
                stroke="#2563EB"
                tick={{ fontSize: 12, angle: -45, textAnchor: "end" }}
                height={60}
              />

              {/* Sumbu Y (total), format Rp */}
              <YAxis
                stroke="#2563EB"
                tickFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                width={100}
              />

              {/* Tooltip saat hover */}
              <ReTooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              />

              {/* Area di bawah kurva */}
              <Area
                type="monotone"
                dataKey="total"
                stroke="#2563EB"
                fillOpacity={0.2}
                fill="#2563EB"
                dot={{ r: 5, fill: "#2563EB" }}
                activeDot={{ r: 7 }}
                name="Total Harian"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== 3) Tabel + Grafik Penjualan Bulanan (AreaChart) ===== */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          📅 Penjualan Bulanan
        </h2>

        {/* – Tabel Bulanan */}
        <div className="bg-white rounded-lg overflow-hidden shadow mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-700">
              <tr>
                <th className="p-3">Bulan</th>
                <th className="p-3">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonthlySales.map((sale, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{sale.month}</td>
                  <td className="p-3">
                    Rp {sale.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              {filteredMonthlySales.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={2}>
                    {!selectedDate
                      ? "Tidak ada data"
                      : `Tidak ada transaksi pada bulan ${selectedDate
                          .toISOString()
                          .split("T")[0]
                          .slice(0, 7)}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* – Grafik Bulanan (AreaChart dengan shading) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={filteredMonthlySales}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              {/* Grid halus */}
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />

              {/* Sumbu X (bulan), dimiringkan 45° */}
              <XAxis
                dataKey="month"
                stroke="#047857"
                tick={{ fontSize: 12, angle: -45, textAnchor: "end" }}
                height={60}
              />

              {/* Sumbu Y (total), format Rp */}
              <YAxis
                stroke="#047857"
                tickFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                width={100}
              />

              {/* Tooltip saat hover */}
              <ReTooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              />

              {/* Legend */}
              <Legend />

              {/* Area di bawah kurva */}
              <Area
                type="monotone"
                dataKey="total"
                stroke="#047857"
                fillOpacity={0.15}
                fill="#047857"
                dot={{ r: 5, fill: "#047857" }}
                activeDot={{ r: 7 }}
                name="Total Bulanan"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== 4) Produk / Jasa Terlaris Hari Ini ===== */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">
          🔥 Produk / Jasa Terlaris Hari Ini
        </h2>

        {/* – Grafik Terlaris (BarChart) */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topItems}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              {/* Grid halus */}
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />

              {/* Sumbu X (nama item), dimiringkan sedikit */}
              <XAxis
                dataKey="name"
                stroke="#DC2626"
                tick={{ fontSize: 12, angle: -15, textAnchor: "end" }}
              />

              {/* Sumbu Y (jumlah terjual) */}
              <YAxis stroke="#DC2626" width={80} />

              {/* Tooltip saat hover batang */}
              <ReTooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                formatter={(value) => value}
              />

              {/* Legend kecil */}
              <Legend />

              {/* Batang dengan shading */}
              <Bar dataKey="total" fill="#DC2626" name="Jumlah Terjual">
                <LabelList dataKey="total" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* – Tabel Terlaris */}
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
              {topItems.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={3}>
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
