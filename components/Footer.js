import React from "react";
import { FaGithub, FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200">
      {/* Main footer grid */}
      <div
        className="
          w-[90vw] max-w-full mx-auto px-6 py-12
          grid
          grid-cols-1            /* default 1 kolom untuk mobile */
          sm:grid-cols-2          /* 2 kolom untuk small screen */
          lg:grid-cols-[3fr_1fr_1fr_1fr]  /* di lg+: 4 kolom; kolom 1 = 2fr, kolom 2–4 = 1fr */
          gap-8
        "
      >
        {/* Brand & Deskripsi */}
        <div className="pr-16 max-w-md">
          <h2 className="text-3xl font-script text-white mb-4">PawTrip</h2>
          <p className="text-sm leading-relaxed mb-6">
            Selamat datang di PawTrip Pet Shop!<br/>
            Kami adalah sahabat setia Anda dalam merawat hewan peliharaan, menyediakan produk berkualitas dan layanan hangat untuk kebahagiaan mereka.
          </p>
          <div className="flex space-x-4">
            <a href="https://github.com/VedantBhawsar?tab=repositories" 
              target="_blank"
              className="hover:text-white">
              <FaGithub size={20} />
            </a>
            <a href="https://www.instagram.com/afkardhi_/" 
              target="_blank"
              className="hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaFacebookF size={20} />
            </a>
          </div>
        </div>

        {/* Shopping */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 ">Shopping</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/products" className="hover:text-white">Product</a></li>
            <li><a href="/pets" className="hover:text-white">Pets</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Terms &amp; Conditions</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Returns &amp; Refund</a></li>
            <li><a href="#" className="hover:text-white">Survey &amp; Feedback</a></li>
          </ul>
        </div>

        {/* Pages */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Pages</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/products" className="hover:text-white">Product</a></li>
            <li><a href="/pets" className="hover:text-white">Pets</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/blog" className="hover:text-white">Blog</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-500">
        © 2025 PawTrip. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
