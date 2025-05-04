import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* 1) Wrapper image + overlay */}
      <div className="relative w-full">
        {/* Gambar composite 1920×987, full-width, height auto */}
        <Image
          src="/img/hero/rectangle-80.jpg"
          alt="Hero background with baked-in elements"
          width={1920}
          height={987}
          className="w-full h-auto object-cover"
          priority
        />


        {/* 2) Text & button overlay */}
        <div className="
            absolute inset-0
            flex flex-col justify-center items-center
            lg:items-start
            text-center lg:text-left
            px-4 sm:px-6 lg:px-16
          ">
          <h1 className="
              font-bold text-[#7F4536] leading-tight
              text-2xl      /* mobile */
              sm:text-3xl  /* ≥640px */
              md:text-4xl  /* ≥768px */
              lg:text-6xl  /* ≥1024px */
            ">
            Dapatkan Makanan<br/>
            Hewan Peliharaan Anda
          </h1>
          <p className="
              mt-3 text-[#7F4536] max-w-md
              text-sm       /* mobile */
              sm:text-base /* ≥640px */
              md:text-lg   /* ≥768px */
            ">
            Hewan peliharaan Anda berhak mendapatkan makanan berkualitas terbaik dan camilan sehat.
          </p>
          <Link
            href="/products"
            className="
              mt-6 inline-block font-medium rounded-2xl
              px-6 py-2 
              sm:px-8 sm:py-3
              bg-[#7F4536] hover:bg-[#6e3c2f]
              text-white transition
            "
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
