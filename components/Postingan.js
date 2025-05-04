// components/Postingan.js
import React from "react";
import Link from 'next/link';

const handleClick = () => {
  alert("Maaf fitur ini masih dalam tahap pengembangan");
};

const posts = [
  {
    id: 1,
    title: "Manfaat Bermain Bersama Hewan Peliharaan bagi Kesejahteraan Mental",
    excerpt:
      "Ulasan tentang bagaimana sesi bermain rutin dapat mengurangi stres, memperkuat ikatan antara pemilik dan hewan, serta meningkatkan kebugaran emosional bagi keduanya.",
    date: "2 April 2023",
    image: "/img/blog/Rectangle-1.png",
  },
  {
    id: 2,
    title: "Panduan Memilih Makanan Terbaik untuk Anjing dan Kucing",
    excerpt:
      "Menjelaskan cara membandingkan label nutrisi, memahami kebutuhan protein hewani, serta memilih makanan sesuai usia dan kondisi kesehatan hewan peliharaan.",
    date: "27 Maret 2023",
    image: "/img/blog/Rectangle-2.png",
  },
  {
    id: 3,
    title: "Tips Memilih Waktu dan Rute Jalan-Jalan yang Ideal",
    excerpt:
      "Waktu terbaik adalah pagi (06:00–08:00) atau sore (17:00–19:00) untuk menghindari cuaca panas dan kerumunan. Pilih jalur dengan permukaan aman dan teduh seperti trotoar lebar atau area taman untuk kenyamanan hewan.",
    date: "22 Maret 2023",
    image: "/img/blog/Rectangle-3.png",
  },
];

const Postingan = () => {
  return (
    <div className="bg-[#CEB8B3] w-full">
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 relative">
          <h2 className="text-3xl font-bold text-[#4E3628]">BLOG TERBARU</h2>
          <Link
            href="/blog"
            className="px-4 py-1 border border-[#4E3628] rounded-full text-xs font-medium text-[#4E3628] hover:bg-[#4E3628] hover:text-white transition"
          >
            LIHAT YANG LAINNYA
          </Link>
        </div>

        <div className="h-[4px] bg-[#4E3628] mb-4" />

        {/* Grid Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-[#4E3628] rounded-2xl overflow-hidden flex flex-col"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow bg-[#f1eae5]">
                <h3 className="font-bold uppercase text-sm mb-2 text-black">
                  {post.title}
                </h3>
                <p className="text-black text-xs flex-grow leading-snug text-justify">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-black text-xs">{post.date}</span>
                  <button
                    onClick={handleClick}
                    className="px-4 py-1 bg-[#bda697] border border-[#4E3628] rounded-full text-xs font-medium text-black hover:bg-[#987A67] transition"
                  >
                    BACA SELENGKAPNYA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Postingan;
