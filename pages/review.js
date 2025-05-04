import React from "react";

const reviews = [
  {
    id: 1,
    text: "Saya sangat puas dengan pelayanan PawTrip Pet Shop. Kualitas produk yang ditawarkan benar-benar memenuhi harapan, dan staffnya ramah serta selalu sigap membantu.",
    name: "Anna",
    image: "/img/about/ellipse-317.png",
  },
  {
    id: 2,
    text: "PawTrip Pet Shop selalu memberikan pelayanan yang ramah dan responsif. Setiap kunjungan membuat saya semakin yakin bahwa hewan kesayangan saya berada di tangan yang tepat.",
    name: "Sindy",
    image: "/img/about/ellipse-319.png",
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-10 mb-16 bg-white">
      <div className="w-[80vw] mx-auto">
        {/* Judul */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-12">
          Review dari Pelanggan<br />Paw Trip
        </h2>

        {/* Grid kartu review */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="
                flex flex-row items-start 
                bg-[#f1eae5] border border-[#4e3628] 
                rounded-lg overflow-hidden 
                p-6 md:p-7 gap-6
              "
            >
              {/* Teks */}
              <div className="flex-1">
                <p className="text-[#444] text-base leading-relaxed text-left">
                  {r.text}
                </p>
                <p className="mt-4 font-bold text-xl text-[#222] text-left">
                  {r.name}
                </p>
              </div>

              {/* Avatar di kanan */}
              <div className="w-[80px] h-[80px] flex-shrink-0">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover rounded-full border border-[#DDD]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
