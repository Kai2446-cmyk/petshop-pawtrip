import React from 'react';
import { IconDog, IconBuildingWarehouse, IconScissors } from '@tabler/icons-react';

const services = [
  {
    id: 1,
    title: 'Dog Walking',
    description: 'Jasa jalan-jalan teratur agar anjing tetap sehat dan bahagia.',
    Icon: IconDog
  },
  {
    id: 2,
    title: 'Pet Boarding',
    description: 'Tempat menginap nyaman saat Anda sedang bepergian.',
    Icon: IconBuildingWarehouse
  },
  {
    id: 3,
    title: 'Grooming',
    description: 'Perawatan mandi, potong bulu, dan perawatan kuku lengkap.',
    Icon: IconScissors
  }
];

const ServicesSection = () => (
  <section className="bg-[#CEB8B3] pt-16 pb-32 flex justify-center items-center">
    <div className="w-[70vw] max-w-full px-4">
      {/* Section Header */}
      <div className="text-center mb-7">
        <h2 className="text-4xl font-bold text-black">Layanan Kami</h2>
      </div>
      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
        {services.map(({ id, title, description, Icon }) => (
          <div key={id} className="text-center p-6 border border-[#4E3628] rounded-2xl shadow-sm bg-white">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#CEB8B3] rounded-full flex items-center justify-center">
              <Icon size={40} stroke={1.5} className="text-[#4E3628]" />
            </div>
            <h3 className="text-2xl font-semibold text-black mb-2">{title}</h3>
            <p className="text-gray-800">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
