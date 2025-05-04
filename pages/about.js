import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";


const reviews = [
  {
    id: 1,
    text: "Saya sangat puas dengan pelayanan PawTrip Pet Shop. Kualitas produk yang ditawarkan benar-benar memenuhi harapan, dan stafnya ramah serta selalu sigap membantu.",
    name: "Anna",
    image: "/img/about/ellipse-317.png",
  },
  {
    id: 2,
    text: "Pengalaman grooming di PawTrip luar biasa! Meskipun harga sedikit di atas ekspektasi, hasilnya sangat memuaskan dan kebersihan tempatnya terjaga dengan baik.",
    name: "Rian",
    image: "/img/about/ellipse-318.png",
  },
  {
    id: 3,
    text: "PawTrip Pet Shop selalu memberikan pelayanan yang ramah dan responsif. Setiap kunjungan membuat saya semakin yakin bahwa hewan kesayangan saya berada di tangan yang tepat.",
    name: "Sindy",
    image: "/img/about/ellipse-319.png",
  },
];

const features = [
  {
    id: 1,
    text: "Kualitas Terjamin: Kami hanya menyediakan produk dari merek tepercaya, memastikan keamanan dan kesehatan hewan kesayangan Anda.",
  },
  {
    id: 2,
    text: "Tenaga Ahli: Tim kami terdiri dari dokter hewan dan staf berpengalaman yang siap membantu Anda.",
  },
  {
    id: 3,
    text: "Pelayanan Ramah: Kami mengutamakan kepuasan pelanggan dengan memberikan pelayanan cepat, tepat, dan bersahabat.",
  },
  {
    id: 4,
    text: "Komunitas Peduli: Kami rutin mengadakan kegiatan sosial dan edukasi untuk meningkatkan kesadaran akan kesejahteraan hewan di masyarakat.",
  },
];

const bgImage = "/img/blog/Rectangle-70.png";  // ganti sesuai path gambarmu
const title = "About";
const breadcrumb = [
  { label: "Home", link: "/" },
  { label: "About" }
];

const About = () => {
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

      <div className="bg-white flex flex-col w-full">

        {/* About Section */}
        <section className="w-full flex justify-center">
          <div className="w-full max-w-[1400px] bg-white py-20 px-6">
            <div className="flex flex-col md:flex-row gap-x-24">
              <div className="md:w-2/3 md:pr-8 self-center">
                <p className="font-['Inria_Sans',Helvetica] font-normal text-black text-3xl text-justify">
                  PawTrip Pet Shop adalah toko hewan peliharaan yang berkomitmen untuk memberikan pengalaman terbaik bagi Anda dan hewan kesayangan. Kami menyediakan berbagai produk, layanan, dan informasi yang dibutuhkan untuk menjaga
                  kesehatan, kebahagiaan, dan kenyamanan hewan peliharaan Anda.
                </p>
              </div>
              <div className="md:w-1/3 mt-8 md:mt-0">
                <img className="w-full h-auto object-cover" alt="Pexels pixabay" src="/img/about/pexels-pixabay-220938-1.png" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-[#bda697] py-20 px-6">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-10 md:mb-0">
              <img className="w-full max-w-[398px] h-auto" alt="Pexels didsss" src="/img/about/pexels-didsss-3734865-1.png" />
            </div>
            <div className="md:w-2/3 md:pl-16 self-center">
              <ul className="space-y-8">
                {features.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-4">
                    <div className="w-[30px] h-[30px] mt-1 bg-[#4e3628] rounded-full flex-shrink-0" />
                    <p className="font-['Inria_Sans',Helvetica] font-normal text-[#301e13] text-2xl text-justify">{feature.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="w-full py-24 px-4">
          <div className="max-w-[1370px] mx-auto">
            {/* parent flex di‑center semua anak */}
            <div className="flex gap-x-64 items-center">
              
              {/* heading kiri */}
              <div className="w-2/5 relative">
                <h2 className="font-['Gelasio',Helvetica] text-black text-[72px] leading-tight">
                  Review dari Pelanggan
                  <br/>
                  Paw Trip
                </h2>
                <img
                  className="absolute w-10 h-[26px] ml-[18rem] -mt-20"
                  alt="Quotation mark"
                  src="/img/about/-.svg"
                />
              </div>

              {/* cards kanan */}
              <div className="w-full lg:w-3/5 flex flex-col gap-6">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col md:flex-row items-center md:items-start bg-[#f1eae5] border border-[#4e3628] rounded-lg overflow-hidden p-6 md:p-7 gap-6">
                    <div className="w-full md:flex-1">
                      <p className="text-[#444] text-base leading-relaxed text-justify">
                        {r.text}
                      </p>
                      <p className="mt-4 font-bold text-xl text-[#222] text-center md:text-left">
                        {r.name}
                      </p>
                    </div>
                    <div className="w-[120px] h-[120px] flex-shrink-0 mx-auto md:mx-0">
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
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default About;
