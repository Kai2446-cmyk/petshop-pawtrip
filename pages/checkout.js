// pages/checkout.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Image from "next/image";
import QRCode from "react-qr-code";

const paymentOptions = [
  { label: "BCA", type: "bank", value: "BCA", logo: "/payments/bca.png" },
  { label: "Mandiri", type: "bank", value: "Mandiri", logo: "/payments/mandiri.png" },
  { label: "BNI", type: "bank", value: "BNI", logo: "/payments/bni.png" },
  { label: "OVO", type: "ewallet", value: "OVO", logo: "/payments/ovo.png" },
  { label: "DANA", type: "ewallet", value: "DANA", logo: "/payments/dana.png" },
  { label: "GoPay", type: "ewallet", value: "GoPay", logo: "/payments/gopay.png" },
  { label: "ShopeePay", type: "ewallet", value: "ShopeePay", logo: "/payments/shopeepay.png" },
];

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadCart() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: items, error } = await supabase
        .from("cart")
        .select(`id, quantity, products(name, price, image_url), services(name, price)`)
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      const merged = [];
      items.forEach(item => {
        const name = item.products?.name || item.services?.name || "-";
        const price = item.products?.price || item.services?.price || 0;
        const image = item.products?.image_url || null;
        const existing = merged.find(m => m.name === name && m.price === price);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          merged.push({ name, price, quantity: item.quantity, image });
        }
      });

      setCartItems(merged);
      setTotal(merged.reduce((sum, i) => sum + i.price * i.quantity, 0));
    }
    loadCart();
  }, []);

  const handleSelect = method => {
    setPaymentMethod(method.value);
    setSelectedPayment(method);
  };

  const handlePayment = async () => {
    if (!paymentMethod) return alert("Pilih metode pembayaran.");

    const { data: transaction, error: transactionError } = await supabase
      .from("transaction")
      .insert([
        {
          user_id: user.id,
          total_price: total, // ✅ diganti dari 'total' ke 'total_price'
          status: "pending",
          payment_method: paymentMethod,
          created_at: new Date(),
        },
      ])
      .select()
      .single();

    if (transactionError) {
      console.error("Gagal menyimpan transaksi:", transactionError);
      alert("Terjadi kesalahan saat menyimpan transaksi.");
      return;
    }

    const itemsToInsert = cartItems.map(item => ({
      transaction_id: transaction.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemError } = await supabase
      .from("transaction_items")
      .insert(itemsToInsert);

    if (itemError) {
      console.error("Gagal menyimpan item transaksi:", itemError);
      alert("Gagal menyimpan item transaksi.");
      return;
    }

    await supabase.from("payment_history").insert([
      {
        user_id: user.id,
        transaction_id: transaction.id,
        total,
        method: paymentMethod,
        status: "pending",
        created_at: new Date(),
      },
    ]);

    await supabase.from("cart").delete().eq("user_id", user.id);

    setShowPaymentInfo(true);
  };

  const generateVA = () => "1123-731DDD";

  const renderPaymentDetails = () => {
    if (!selectedPayment) return null;
    if (selectedPayment.type === "bank") {
      return (
        <div className="bg-gray-50 border p-6 mt-6 rounded-xl shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-2">Instruksi Pembayaran</h3>
          <p>Transfer ke VA berikut:</p>
          <p className="text-2xl font-bold mt-2 text-indigo-600">{generateVA()}</p>
          <p className="text-sm text-gray-500 mt-1">A/N: Ardhi Nurhakim</p>
        </div>
      );
    }
    return (
      <div className="bg-gray-50 border p-6 mt-6 rounded-xl shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
        <p className="mb-4">Gunakan {selectedPayment.label}</p>
        <div className="flex justify-center mb-4">
          <QRCode
            value={`https://example.com/pay/${user.id}/${selectedPayment.value}`}
            size={180}
          />
        </div>
        <p className="mt-4">Total: <strong>Rp {total.toLocaleString("id-ID")}</strong></p>
      </div>
    );
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <div className="w-[90vw] max-w-full bg-white px-8 py-6 rounded-2xl shadow-lg">
        <button onClick={() => router.back()} className="mb-6 bg-gray-200 px-4 py-2 rounded-lg">
          ← Kembali
        </button>
        <h1 className="text-3xl text-black font-bold mb-10 mt-16 text-center">Checkout</h1>

        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl text-black font-bold mb-10">Ringkasan Pesanan</h2>
          <div className="grid grid-cols-[1fr,1fr,1fr] items-center justify-items-center text-black font-semibold border-b pb-2">
            <span className="justify-self-start">Produk</span>
            <span>Jumlah Pesanan</span>
            <span className="justify-self-end">Total Harga Barang</span>
          </div>

          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr,1fr,1fr] items-center justify-items-center py-3 border-b last:border-0 gap-4"
            >
              <div className="flex items-center gap-4 justify-self-start">
                {item.image ? (
                  <div className="w-16 h-16 relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg" />
                )}
                <span className="text-xl font-medium text-black">{item.name}</span>
              </div>
              <div className="text-xl text-black justify-self-center flex justify-center">
                {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
              </div>
              <div className="font-semibold text-black justify-self-end">
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="font-semibold text-lg text-gray-800">Total Harga</span>
            <span className="font-semibold text-lg text-black">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pilih Metode Pembayaran</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {paymentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition flex flex-col items-center gap-2 ${
                paymentMethod === option.value
                  ? "border-indigo-500 ring-2 ring-indigo-300"
                  : ""
              }`}
            >
              <img src={option.logo} alt={option.label} className="w-12 h-12 object-contain" />
              <span className="text-sm font-medium text-gray-700">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {!showPaymentInfo ? (
          <div className="text-center">
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium w-full sm:w-auto"
            >
              Selesaikan Pembayaran
            </button>
          </div>
        ) : (
          renderPaymentDetails()
        )}
      </div>
    </div>
  );
}
