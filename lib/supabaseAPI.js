import { supabase } from "./supabase";

export async function registerUser(email, password, username) {
  try {
    // 🔹 Mendaftarkan user ke Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("❌ Error saat register:", error.message);
      return { success: false, message: error.message };
    }

    // 🔹 Pastikan user berhasil dibuat dan memiliki ID
    const user = data.user;
    if (!user || !user.id) {
      console.error("❌ Gagal mendapatkan user ID dari Auth");
      return { success: false, message: "Registrasi gagal: User ID tidak ditemukan" };
    }

    console.log("✅ User berhasil didaftarkan:", user);

    // 🔹 Simpan user ke tabel `users`
    const { error: insertError } = await supabase.from("users").insert([
      { user_id: user.id, email, username, role: "user", created_at: new Date() },
    ]);

    if (insertError) {
      console.error("❌ Gagal menyimpan user ke database:", insertError.message);
      return { success: false, message: "User terdaftar, tapi tidak masuk database!" };
    }

    console.log("✅ User berhasil disimpan ke tabel users!");
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
  if (!user_id) {
    console.error("❌ Gagal menambahkan ke cart: User ID tidak ditemukan!");
    throw new Error("User tidak ditemukan! Silakan login ulang.");
  }

  const { data, error } = await supabase
    .from("cart")
    .insert([{ user_id, product_id, service_id, quantity }]);

  if (error) throw error;
  return data;
}

// ✅ Ambil isi cart dengan harga dari tabel products & services
export async function getCartItems(user_id) {
  if (!user_id) {
    console.error("❌ User ID tidak ditemukan saat mengambil cart.");
    throw new Error("User tidak ditemukan! Silakan login ulang.");
  }

  console.log("🔍 Fetching cart items for user:", user_id);

  const { data, error } = await supabase
    .from("cart")
    .select(`*, 
      products(price), 
      services(price)
    `)
    .eq("user_id", user_id);

  if (error) {
    console.error("❌ Error fetching cart:", error);
    throw error;
  }

  const cartItems = data.map(item => ({
    ...item,
    price: item.product_id ? item.products?.price : item.service_id ? item.services?.price : 0
  }));

  console.log("✅ Cart items fetched:", cartItems);
  return cartItems;
}

// ✅ Checkout: Proses transaksi
export async function checkout(user_id, payment_method) {
  try {
    console.log("🛒 Starting checkout for user:", user_id);

    if (!user_id) {
      throw new Error("User ID tidak valid! Pastikan Anda login.");
    }

    // 🔹 Ambil isi cart user
    const cartItems = await getCartItems(user_id);
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Keranjang kosong! Tambahkan produk sebelum checkout.");
    }

    console.log("🛒 Cart Items:", cartItems);

    // 🔹 Validasi price & quantity
    cartItems.forEach((item, index) => {
      console.log(`🔍 Item ${index + 1}:`, item);
      console.log("   - Price:", item.price);
      console.log("   - Quantity:", item.quantity);
    });

    const validCartItems = cartItems.filter(item => item.price && item.quantity);
    if (validCartItems.length === 0) {
      throw new Error("Cart memiliki item dengan harga atau kuantitas tidak valid.");
    }

    console.log("✅ Valid cart items:", validCartItems);

    // 🔹 Hitung total harga
    const total_price = validCartItems.reduce(
      (sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0
    );

    console.log("💰 Calculated total price:", total_price);

    if (total_price <= 0) {
      throw new Error("Total harga tidak valid.");
    }

    // 🔹 Simpan transaksi utama ke database
    console.log("📦 Inserting transaction...");
    const { data: transaction, error: transactionError } = await supabase
      .from("transaction")
      .insert([{ user_id, total_price, status: "pending", payment_method }])
      .select()
      .single();

    if (transactionError) {
      console.error("❌ Error inserting transaction:", transactionError);
      throw transactionError;
    }

    console.log("✅ Transaction saved:", transaction);

    // 🔹 Simpan tiap item ke transaction_items
    const transactionItems = validCartItems.map((item) => ({
      transaction_id: transaction.id,
      product_id: item.product_id || null,
      service_id: item.service_id || null,
      quantity: item.quantity
    }));

    console.log("📦 Inserting transaction items:", transactionItems);

    // 🔹 Masukkan data transaction_items ke database
    const { error: itemsError } = await supabase.from("transaction_items").insert(transactionItems);
    if (itemsError) {
      console.error("❌ Error inserting transaction items:", itemsError);
      throw itemsError;
    }

    console.log("✅ Transaction items saved!");

    return { success: true, transaction };
  } catch (error) {
    console.error("❌ Checkout error:", error.message);
    return { success: false, message: error.message };
  }
}
