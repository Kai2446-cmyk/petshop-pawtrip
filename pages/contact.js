import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram, FaDiscord, FaFacebook } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const bgImage = "/img/blog/Rectangle-70.png";  // ganti sesuai path gambarmu
const title = "Contact";
const breadcrumb = [
  { label: "Home", link: "/" },
  { label: "Contact" }
];

const ContactUs = () => {
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

        <section className="py-12 bg-white mx-2">
            <div className="max-w-6xl mx-auto border border-gray-300 rounded-xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Panel */}
                <div className="md:w-1/3 bg-[#bda697] p-8 relative flex flex-col justify-between overflow-hidden">
                    <div>
                        <h2 className="text-3xl font-semibold mb-6 text-[#0A192F]">Kontak Informasi</h2>
                        <ul className="space-y-5 text-[#0A192F]">
                            <li className="flex items-center space-x-3 text-sm">
                            <FaPhone className="text-lg" />
                            <span className="text-sm">+0812 3456 789</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm">
                            <FaEnvelope className="text-lg" />
                            <span className="text-sm">petshopeak@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-3 text-sm">
                            <FaMapMarkerAlt className="text-lg mt-1" />
                            <span>
                                Al Haram, Makkah 24236,<br />
                                Saudi Arabia
                            </span>
                            </li>
                        </ul>
                    </div>
                    {/* Decorative Circles */}
                    {/* Big circle slightly overflowing bottom-right */}
                    <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#5b4e44] rounded-full -mb-14 -mr-14" />
                        {/* Small circle at top-left of big circle overlap */}
                    <div className="absolute bottom-20 right-20 w-28 h-28 bg-white opacity-50 rounded-full" />
                        {/* Social Icons with white border */}
                    <div className="flex space-x-4 mt-6">
                        {[FaTwitter, FaInstagram, FaFacebook].map((Icon, idx) => (
                        <span key={idx} className="p-1 bg-white border-2 border-white rounded-full text-[#0A192F] cursor-pointer">
                        <Icon className="text-lg" />
                        </span>
                    ))}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="md:w-2/3 bg-white p-8">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-lg font-medium text-[#0A192F] mb-2">Nama</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="w-full text-base border-b border-gray-300 focus:outline-none py-1"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phone" className="block text-lg font-medium text-[#0A192F] mb-2">Nomer Telepon</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full text-base border-b border-gray-300 focus:outline-none py-1"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-[#0A192F] mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full text-base border-b border-gray-300 focus:outline-none py-1"
                                />
                            </div>

                            <div className="hidden md:block" />

                            {/* Topic Selection */}
                            <div className="md:col-span-2">
                                <span className="block text-lg font-medium text-[#0A192F] mb-2">Pilih Topik</span>
                                <div className="flex items-center space-x-6">
                                    {[
                                    { id: 'masukan', label: 'Masukan & Keluhan' },
                                    { id: 'status', label: 'Status Pesanan' },
                                    { id: 'kerjasama', label: 'Kerjasama' },
                                    { id: 'lainnya', label: 'Lainnya' }
                                    ].map((topic, idx) => (
                                    <label key={topic.id} className="inline-flex items-center">
                                        <input
                                        type="radio"
                                        name="topic"
                                        defaultChecked={idx === 0}
                                        className="form-radio accent-[#000000] text-[#0A192F]"
                                        />
                                        <span className="ml-2 text-base text-[#0A192F]">{topic.label}</span>
                                    </label>
                                    ))}
                                </div>
                            </div>

                            {/* Message Field */}
                            <div className="md:col-span-2">
                                <label htmlFor="message" className="block text-lg font-medium text-[#0A192F] mb-2">Pesan</label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    className="w-full text-base border rounded-md border-gray-300 focus:outline-none p-2 placeholder-gray-400"
                                    placeholder="Write your message.."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="mt-4 bg-[#bda697] text-black py-3 px-8 rounded-md shadow-sm"
                                >
                                    Kirim Pesan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        {/* Map Section */}
        <section className="mb-12 mt-6">
            <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col mb-5">
                        <h2 className="text-3xl font-bold text-[#4E3628]">Lokasi Toko Kami</h2>
                        <div className="w-full h-1 bg-[#4E3628] mt-1" />
                    </div>
                <div className="w-full h-80 md:h-[450px] rounded-lg overflow-hidden shadow">
                <iframe
                    title="Google Map"
                    src="https://maps.google.com/maps?q=Kaaba%2C%20Mecca%2C%20Saudi%20Arabia&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                </div>
            </div>
        </section>
        <Footer />
    </>
  );
};

export default ContactUs;

