import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdoptionSection() {
  const images = [
    { src: "/img/adoption/pet-1.png", alt: "Anjing tersenyum" },
    { src: "/img/adoption/pet-2.png", alt: "Kelinci lucu" },
    { src: "/img/adoption/pet-3.png", alt: "Tikus kecil" },
    { src: "/img/adoption/pet-4.png", alt: "Kucing berbulu tebal" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-[80vw] mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Grid Foto: lg kolom jadi 6/12 (umur sedikit lebih kecil) */}
        <div className="grid grid-cols-2 gap-6 w-full lg:w-6/12">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="w-full aspect-square rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={600}
                className="object-cover object-center w-full h-full"
                priority={idx < 2}
              />
            </div>
          ))}
        </div>

        {/* Teks & tombol */}
        <div className="w-full lg:w-6/12 text-center lg:text-left">
          <h2 className="
              font-semibold text-gray-900 leading-tight
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              max-w-2xl mx-auto lg:mx-0
            ">
            Cari Tahu Teman Baru<br/>
            Mana yang Paling Cocok untuk Anda!
          </h2>
          <p className="
              mt-6 text-gray-600 
              text-base sm:text-lg md:text-xl
              max-w-2xl mx-auto lg:mx-0 text-justify
            ">
            Temukan pendamping ideal yang sangat cocok dengan gaya hidup
            dan kepribadian Anda. Apakah Anda mencari teman bermain untuk
            petualangan luar ruangan atau teman yang nyaman untuk malam hari,
            beragam pilihan hewan peliharaan kami menanti untuk Anda temukan.
          </p>
          <Link
            href="/pets"
            className="
              mt-8 inline-flex items-center justify-center
              px-6 py-2 sm:px-8 sm:py-3
              border-2 border-[#7F4536] text-[#7F4536]
              font-medium rounded-lg
              hover:bg-[#7F4536] hover:text-white
              transition-colors duration-200
            "
          >
            Lihat
            <span className="ml-2 text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}