// components/ServiceCard.jsx
import React from "react";

import { supabase } from "../lib/supabase";

const ServiceCard = ({ service, userId }) => {
  const handleAddToCart = async () => {
    const { data, error } = await supabase.from("cart").insert([
      {
        user_id: userId,
        service_id: service.id,
        quantity: 1,
        type: "service",
      },
    ]);

    if (error) {
      alert("Gagal menambahkan ke keranjang!");
    } else {
      alert("Layanan berhasil dimasukkan ke keranjang!");
    }
  };

  return (
    <div className="card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p>Harga: Rp{service.price}</p>
      <button onClick={handleAddToCart}>Tambah ke keranjang</button>
    </div>
  );
};

export default ServiceCard;
