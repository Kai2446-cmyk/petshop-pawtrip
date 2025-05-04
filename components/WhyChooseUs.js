// src/components/WhyChooseUs.jsx
import React from 'react';
import Link from 'next/link';
import {
  IconUsers,
  IconClockHour3,
  IconContract,
  IconShoppingBag,
} from '@tabler/icons-react';

const whyChooseUsData = [
  {
    title: 'Tim yang expert',
    text: 'Di PawTrip, tim perawatan hewan kami adalah para ahli dengan pengalaman bertahun-tahun menangani grooming, kebersihan, dan kesehatan sahabat berbulu Anda. Mulai dari memandikan hingga memotong kuku dan merawat bulu, setiap langkah dikerjakan dengan presisi dan cinta. Percayakan pada kami untuk membuat hewan peliharaan Anda tampil bersih, sehat, dan bahagia.',
    svg: <IconUsers stroke={1.5} className="w-14 h-14 mobile:w-10 mobile:h-10" />,
  },
  {
    title: 'Kenyamanan',
    text: 'Kami mengerti kesibukan Anda, oleh karena itu PawTrip memudahkan segala layanan lewat penjadwalan fleksibel dan pengantaran langsung ke pintu rumah. Dengan PawTrip, kenyamanan merawat sahabat berbulu ada di ujung jari Anda.',
    svg: <IconClockHour3 stroke={1.5} className="w-14 h-14 mobile:w-10 mobile:h-10" />,
  },
  {
    title: 'Komitmen',
    text: 'Di PawTrip, kami berkomitmen menghadirkan layanan dengan standar kesejahteraan hewan tertinggi mulai dari pakan bergizi hingga grooming profesional, agar setiap sahabat berbulu Anda selalu mendapatkan perawatan terbaik dan aman. Kami juga mendukung praktik ramah lingkungan dengan menggunakan produk mudah terurai dan mengurangi limbah, sehingga Anda turut berperan menjaga bumi untuk generasi hewan peliharaan selanjutnya.',
    svg: <IconContract stroke={1.5} className="w-14 h-14 mobile:w-10 mobile:h-10" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us w-[80vw] mx-auto my-20 flex gap-16 mobile:flex-col mobile:w-full mobile:px-4 tablet:w-[90vw]">
      
      {/* Left content */}
      <div className="left flex flex-col gap-4 w-3/5 h-fit sticky top-20 mobile:static mobile:w-full mobile:items-center tablet:w-2/5">
        <h2 className="title font-bold text-3xl mobile:text-center">
          Kenapa harus memilih PawTrip?
        </h2>
        <p className="text-lg text-black/[.7] mobile:text-center text-justify">
          Di PawTrip, kami menjadi sahabat setia hewan peliharaan Anda dengan layanan lengkap: 
          pakan berkualitas, grooming profesional, dan penitipan nyaman. 
          Semua bisa dipesan mudah lewat aplikasi atau website, 
          dengan pilihan jadwal fleksibel dan opsi pengantaran langsung ke rumah. 
          Nikmati kemudahan merawat hewan kesayangan Anda bersama PawTrip, karena kebahagiaan mereka adalah prioritas kami.
        </p>
        <Link href="/products" passHref>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            <span>Pesan sekarang</span>
            <IconShoppingBag stroke={1.5} className="w-6 h-6" />
          </button>
        </Link>
      </div>

      {/* Right content */}
      <div className="right flex flex-col gap-8 w-2/5 mobile:w-full tablet:w-3/5">
        {whyChooseUsData.map((item, index) => (
          <div className="flex gap-4 items-start" key={index}>
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center p-4">
              {item.svg}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">{item.title}</h3>
              <p className="text-sm text-justify">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
