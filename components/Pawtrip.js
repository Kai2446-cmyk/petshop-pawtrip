import React from "react";        
        
        
const PawTrip = () => {
    return (        
        <section className="relative w-full h-[360px] bg-[#bda697] flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <img className="absolute w-[136px] h-[145px] top-[20px] left-[1553px] rotate-12" alt="Cat footprint" src="/img/about/cat-footprint-4.png"/>
          <img className="absolute w-[142px] h-[145px] top-[84px] left-[1383px] -rotate-12" alt="Cat footprint" src="/img/about/cat-footprint-4.png" />
          <img className="absolute w-[79px] h-[82px] top-[234px] left-[1450px] -rotate-12" alt="Cat footprint" src="/img/about/cat-footprint-4.png" />
          <img className="absolute w-[170px] h-[170px] top-[160px] left-[1570px]" alt="Kalung" src="/img/blog/Kalung.svg" />
          <img className="absolute w-[65px] h-[65px] top-[109px] left-[140px]" alt="Vector" src="/img/about/vector.svg" />
          <img className="absolute w-[478px] h-[347px] top-[13px] left-[170px]" alt="Rectangle" src="/img/about/rectangle-49.png" />
          </div>

          <div className="absolute left-[650px] top-[60px]">
              <h2 className="font-['Prata',Helvetica] font-normal text-black text-[100px] leading-tight">Paw Trip</h2>
          </div>

          <div className="absolute left-[860px] top-[180px]">
              <h2 className="font-['Prata',Helvetica] font-normal text-black text-[100px] leading-tight">Pet Shop</h2>
          </div>
        </section>

    );
};

export default PawTrip;