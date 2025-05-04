import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Header from "../components/Header";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Ambil user yang sedang login
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchCart(user.id);
  }, [user]);

  const fetchCart = async (user_id) => {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `id, quantity, products(name, price, image_url), services(name, price)`
      )
      .eq("user_id", user_id)
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data cart:", error);
      return;
    }

    // Merge duplikat dan kumpulkan rowIds
    const merged = [];
    data.forEach((item) => {
      const key = item.products
        ? `p-${item.products.name}`
        : `s-${item.services.name}`;
      const existing = merged.find((m) => m._key === key);
      if (existing) {
        existing.quantity += item.quantity;
        existing.rowIds.push(item.id);
      } else {
        merged.push({ ...item, _key: key, rowIds: [item.id] });
      }
    });

    setCart(merged);
    calculateSubtotal(merged);
  };

  const calculateSubtotal = (items) => {
    const sub = items.reduce((sum, item) => {
      const price = item.products ? item.products.price : item.services.price;
      return sum + price * item.quantity;
    }, 0);
    setSubtotal(sub);
  };

  const handleRemove = async (item) => {
    // Hapus semua baris untuk item ini
    for (const id of item.rowIds) {
      await supabase.from("cart").delete().eq("id", id);
    }
    fetchCart(user.id);
  };

  const handleUpdateQty = async (item, delta) => {
    const newQty = item.quantity + delta;
    // Jika quantity baru kurang dari 1, hapus item
    if (newQty < 1) {
      await handleRemove(item);
      return;
    }

    // update evenly across underlying rows
    const totalRows = item.rowIds.length;
    const baseQty = Math.floor(newQty / totalRows);
    const extra = newQty % totalRows;
    for (let i = 0; i < totalRows; i++) {
      const targetQty = baseQty + (i === 0 ? extra : 0);
      await supabase
        .from("cart")
        .update({ quantity: targetQty })
        .eq("id", item.rowIds[i]);
    }

    // Refresh data
    fetchCart(user.id);
  };

  const handleCheckout = () => router.push("/checkout");
  const handleCoupon = () => alert("Fitur ini masih dalam tahap pengembangan");

  return (
    <>
      <Header />
      <div className="flex justify-center py-10 bg-gray-50">
        <div className="w-[90vw] max-w-full bg-white px-8 py-16 rounded-2xl shadow-lg">
          <h1 className="text-center text-black text-4xl font-bold mb-6">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-pulse">😺</div>
              <p className="text-lg text-gray-600 mb-6">Keranjangmu masih kosong!</p>
              <Link href="/products">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition">
                  🛍️ Lihat Produk
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Tabel Keranjang */}
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full table-auto">
                  <thead>
                    <tr className="text-left text-black border-b">
                      <th className="py-2">Product</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const product = item.products || item.services;
                      const price = product.price;
                      const itemTotal = price * item.quantity;
                      return (
                        <tr key={item._key} className="border-b hover:bg-gray-50">
                          <td className="py-4 flex items-center gap-4">
                            {item.products?.image_url && (
                              <div className="w-20 h-20 relative">
                                <Image
                                  src={item.products.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-800">{product.name}</div>
                              <div className="text-sm text-gray-500">Rp {price.toLocaleString("id-ID")}</div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="inline-flex items-center border rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleUpdateQty(item, -1)}
                                className="px-3 py-1 text-gray-600"
                              >
                                −
                              </button>
                              <span className="px-4 py-1 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(item, 1)}
                                className="px-3 py-1 text-gray-600"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-black">Rp {itemTotal.toLocaleString("id-ID")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Ringkasan Harga */}
              <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between py-2 text-xl text-black font-bold">
                  <span>Total</span>
                  <span className="text-black">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-4 pt-6">
                <button
                  onClick={handleCoupon}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-medium rounded-full transition max-w-max mx-auto sm:mx-0"
                >
                  Add Coupon Code
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium rounded-full transition max-w-max mx-auto sm:mx-0"
                >
                  Continue to Payment →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}