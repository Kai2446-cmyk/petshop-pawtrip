import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const handleClick = () => {
    alert('Maaf fitur ini masih dalam tahap pengembangan');
};

const posts = [
    {
      id: 1,
      title: 'Manfaat Bermain Bersama Hewan Peliharaan bagi Kesejahteraan Mental',
      excerpt:
        'Ulasan tentang bagaimana sesi bermain rutin dapat mengurangi stres, memperkuat ikatan antara pemilik dan hewan, serta meningkatkan kebugaran emosional bagi keduanya.',
      date: '4 April 2025',
      image: "/img/blog/Rectangle-1.png",
    },
    {
      id: 2,
      title: 'Panduan Memilih Makanan Terbaik untuk Anjing dan Kucing',
      excerpt:
        'Menjelaskan cara membandingkan label nutrisi, memahami kebutuhan protein hewani, serta memilih makanan sesuai usia dan kondisi kesehatan hewan peliharaan.',
      date: '27 Maret 2025',
      image: "/img/blog/Rectangle-2.png",
    },
    {
      id: 3,
      title: 'Tips Memilih Waktu dan Rute Jalan-Jalan yang Ideal',
      excerpt:
        'Waktu terbaik adalah pagi (06:00–08:00) atau sore (17:00–19:00) untuk menghindari cuaca panas dan kerumunan. Pilih jalur dengan permukaan aman dan teduh seperti trotoar lebar atau area taman untuk kenyamanan hewan.',
      date: '22 Maret 2025',
      image: "/img/blog/Rectangle-3.png",
    },
    {
      id: 4,
      title: 'Panduan Adopsi Hewan: Persiapan dan Perawatan Awal',
      excerpt:
        'Langkah-langkah penting sebelum dan sesudah adopsi—mulai dari menyiapkan ruang khusus, memilih perlengkapan dasar, hingga tips adaptasi agar hewan baru cepat nyaman.',
      date: '14 Maret 2025',
      image: '/img/blog/Rectangle-4.jpg',
    },
    {
      id: 5,
      title: 'Profil Ras: Kenali Karakteristik dan Kebutuhan Khusus',
      excerpt:
        'Mengulas satu ras hewan peliharaan per artikel, termasuk sifat, kebutuhan nutrisi, dan tips perawatan khusus sesuai karakter ras.',
      date: '3 Maret 2025',
      image: '/img/blog/Rectangle-5.jpg',
    },
    {
      id: 6,
      title: 'Perawatan Bulanan: Jadwal Vaksinasi, Cek Kesehatan, dan Pencegahan Paras',
      excerpt:
        'Rincian rekomendasi jadwal vaksin, pemeriksaan rutin ke dokter hewan, serta cara pencegahan kutu dan cacing untuk menjaga hewan peliharaan tetap prima setiap bulan.',
      date: '24 Februari 2025',
      image: '/img/blog/Rectangle-6.jpg',
    },
];

const bgImage = "/img/blog/Rectangle-70.png";  // ganti sesuai path gambarmu
const title = "Blog";
const breadcrumb = [
  { label: "Home", link: "/" },
  { label: "Blog" }
];

const Blog = () => {
    return (
      <>
        <Header />
        <section
          className="relative w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center text-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay warna + blur */}
          <div className="absolute inset-0 bg-[#BDA697]/20 backdrop-blur-sm"></div>

          {/* Content */}
          <div className="relative z-10 px-4">
            <h1 className="text-black text-4xl md:text-6xl font-bold mb-4">
              {title}
            </h1>
            <nav className="text-black text-base md:text-lg">
              {breadcrumb.map((item, idx) => (
                <span key={idx} className="inline-flex items-center">
                  {item.link ? (
                    <a href={item.link} className="hover:underline">
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  {idx < breadcrumb.length - 1 && (
                    <span className="mx-2">&gt;</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </section>
  
        <div className="bg-white flex w-full">
          <div className="w-full overflow-hidden">
  
            <section className="w-full max-w-[1400px] mx-auto px-4 py-12">
              <div className="flex flex-col mb-8">
                <h2 className="text-3xl font-bold text-[#4E3628]">Terbaru</h2>
                <div className="w-full h-1 bg-[#4E3628] mt-2" />
              </div>
  
              {/* Responsif: Stacked on mobile, row on md+ */}
              <div className="flex flex-col md:flex-row items-start gap-y-6 md:gap-x-24">
  
                {/* Image Card */}
                <div className="w-full md:w-2/5 rounded-3xl border-2 border-[#4E3628]">
                  <img
                    src="/img/blog/Rectangle-56.jpg"
                    alt="Kucing stres"
                    className="w-full h-auto md:h-[465px] object-cover rounded-3xl"
                  />
                </div>
  
                {/* Text Content */}
                <div className="w-full md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-black">
                      Cara Merawat Kucing Saat Kucing Sedang Stres
                    </h3>
                    <p className="text-black leading-relaxed text-justify mb-6">
                      Kucing yang stres biasanya menunjukkan tanda seperti sembunyi,
                      agresi, atau nafsu makan menurun. Berikan area istirahat yang
                      tenang dan nyaman, jauh dari suara keras atau gangguan visual.
                      Sediakan mainan interaktif atau catnip untuk merangsang aktivitas
                      fisik dan mentalnya. Jaga rutinitas harian, termasuk waktu makan,
                      minum, dan kebersihan kotak pasir agar kucing merasa aman. Jika
                      gejala stres terus berlanjut, pertimbangkan penggunaan diffuser
                      feromon sintetis seperti Feliway atau konsultasi ke dokter hewan.
                    </p>
                  </div>
  
                  {/* Footer: Button and Date */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleClick}
                      className="px-5 py-2 bg-[#bda697] border border-[#4E3628] rounded-full text-black text-sm font-medium hover:bg-[#987A67] transition"
                    >
                      BACA SELENGKAPNYA
                    </button>
                    <span className="text-black text-sm">20 April 2025</span>
                  </div>
                </div>
  
              </div>
            </section>
  
            <section className="w-full max-w-[1400px] mx-auto px-4 py-2">
              <div className="flex flex-col mb-8">
                <h2 className="text-3xl font-bold text-[#4E3628]">Artikel Lainnya</h2>
                <div className="w-full h-1 bg-[#4E3628] mt-2" />
              </div>
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
  
              <div className="flex items-center py-8 mb-8">
                <div className="flex-grow h-1 bg-[#4E3628]" />
                <button
                  onClick={handleClick}
                  className="mx-4 px-5 py-2 bg-[#bda697] border border-[#4E3628] rounded-full text-sm font-medium text-black hover:bg-[#987A67] transition"
                >
                  LIHAT YANG LAINNYA
                </button>
                <div className="flex-grow h-1 bg-[#4E3628]" />
              </div>
            </section>
          </div>
        </div>
  
        <Footer />
      </>
    );
  };
  
export default Blog;