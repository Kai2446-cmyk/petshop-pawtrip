import { supabase } from "./supabase";

// ✅ Register User
export async function registerUser(email, password, username) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("❌ Error saat register:", error.message);
      return { success: false, message: error.message };
    }

    const user = data.user;
    if (!user || !user.id) {
      console.error("❌ Gagal mendapatkan user ID dari Auth");
      return { success: false, message: "Registrasi gagal: User ID tidak ditemukan" };
    }

    const { error: insertError } = await supabase.from("users").insert([
      { user_id: user.id, email, username, role: "user", created_at: new Date() },
    ]);

    if (insertError) {
      console.error("❌ Gagal menyimpan user ke database:", insertError.message);
      return { success: false, message: "User terdaftar, tapi tidak masuk database!" };
    }

    return { success: true, message: "Registrasi berhasil!" };
  } catch (error) {
    console.error("❌ Terjadi kesalahan:", error.message);
    return { success: false, message: "Terjadi kesalahan saat registrasi." };
  }
}

// ✅ Ambil semua produk
export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) console.error("Error fetching products:", error);
  return data;
};

// ✅ Ambil semua hewan adopsi
export const getPets = async () => {
  const { data, error } = await supabase.from("pets").select("*");
  if (error) console.error("Error fetching pets:", error);
  return data;
};

// ✅ Ambil semua layanan
export const getServices = async () => {
  const { data, error } = await supabase.from("services").select("*");
  if (error) console.error("Error fetching services:", error);
  return data;
};

// ✅ Logout user
export const logout = async () => {
  await supabase.auth.signOut();
};

// ✅ Tambah item ke cart
export async function addToCart(user_id, product_id, service_id, quantity) {
  if (!user_id) throw new Error("User tidak ditemukan! Silakan login ulang.");

  const { data, error } = await supabase
    .from("cart")
    .insert([{ user_id, product_id, service_id, quantity }]);

  if (error) throw error;
  return data;
}

// ✅ Ambil isi cart
export async function getCartItems(user_id) {
  if (!user_id) throw new Error("User tidak ditemukan! Silakan login ulang.");

  const { data, error } = await supabase
    .from("cart")
    .select(`*, products(price), services(price)`)
    .eq("user_id", user_id);

  if (error) throw error;

  return data.map(item => ({
    ...item,
    price: item.product_id ? item.products?.price : item.service_id ? item.services?.price : 0,
  }));
}

// ✅ Checkout
export async function checkout(user_id, payment_method) {
  try {
    if (!user_id) throw new Error("User ID tidak valid! Pastikan Anda login.");

    const cartItems = await getCartItems(user_id);
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Keranjang kosong! Tambahkan produk sebelum checkout.");
    }

    const validCartItems = cartItems.filter(item => item.price && item.quantity);
    if (validCartItems.length === 0) {
      throw new Error("Cart memiliki item dengan harga atau kuantitas tidak valid.");
    }

    const total_price = validCartItems.reduce(
      (sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0
    );

    if (total_price <= 0) throw new Error("Total harga tidak valid.");

    const { data: transaction, error: transactionError } = await supabase
      .from("transaction")
      .insert([{ user_id, total_price, status: "pending", payment_method }])
      .select()
      .single();

    if (transactionError) throw transactionError;

    const transactionItems = validCartItems.map(item => ({
      transaction_id: transaction.id,
      product_id: item.product_id || null,
      service_id: item.service_id || null,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("transaction_items")
      .insert(transactionItems);

    if (itemsError) throw itemsError;

    return { success: true, transaction };
  } catch (error) {
    console.error("❌ Checkout error:", error.message);
    return { success: false, message: error.message };
  }
}

// 🔥 Tambahan fungsi untuk statistik harian dan bulanan:

// ✅ Ambil semua transaksi yang sudah dibayar
export const getPaidTransactions = async () => {
  const { data, error } = await supabase
    .from("transaction")
    .select("id, created_at, total_price, status")
    .eq("status", "paid");

  if (error) {
    console.error("❌ Error fetching paid transactions:", error);
    return [];
  }

  return data;
};

// ✅ Ambil item berdasarkan ID transaksi (array)
export const getItemsByTransactionIds = async (transactionIds = []) => {
  const { data, error } = await supabase
    .from("transaction_items")
    .select("transaction_id, product_id, service_id, quantity")
    .in("transaction_id", transactionIds);

  if (error) {
    console.error("❌ Error fetching transaction items:", error);
    return [];
  }

  return data;
};

// ✅ Ambil nama produk dari ID
export const getProductNameById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("name")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`❌ Error fetching product name with id ${id}:`, error);
    return null;
  }

  return data?.name || "Produk Tidak Diketahui";
};

// ✅ Ambil nama layanan dari ID
export const getServiceNameById = async (id) => {
  const { data, error } = await supabase
    .from("services")
    .select("name")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`❌ Error fetching service name with id ${id}:`, error);
    return null;
  }

  return data?.name || "Layanan Tidak Diketahui";
};
