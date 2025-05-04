import React, { useState } from "react";
import Image from "next/image";
import Pet1Img from "../public/img/pets/1.png";
import Pet2Img from "../public/img/pets/2.png";
import Pet3Img from "../public/img/pets/3.png";
import Pet4Img from "../public/img/pets/4.png";
import Pet5Img from "../public/img/pets/5.png";
import Pet6Img from "../public/img/pets/6.png";
import Pet7Img from "../public/img/pets/7.png";
import Pet8Img from "../public/img/pets/8.png";
import Pet9Img from "../public/img/pets/9.png";
import Pet10Img from "../public/img/pets/10.png";
import Pet11Img from "../public/img/pets/11.png";
import Pet12Img from "../public/img/pets/12.png";
import Badge from "../public/img/pets/badge.svg";

const pets = [
  { id: 1, category: "dog", name: "milo", image: Pet1Img },
  { id: 2, category: "cat", name: "rotty", image: Pet2Img },
  { id: 3, category: "dog", name: "fexxie", image: Pet3Img },
  { id: 4, category: "cat", name: "Luthfi", image: Pet4Img },
  { id: 8, category: "cat", name: "ynna", image: Pet8Img },
  { id: 11, category: "dog", name: "jasper", image: Pet11Img },
];

const Pets = () => {
  const [selectedPet, setSelectedPet] = useState({
    id: 4,
    category: "cat",
    name: "Luthfi",
    image: Pet4Img,
  });

  const handleSelect = (id) => {
    const pet = pets.find((pet) => pet.id === id);
    setSelectedPet(pet);
  };

  return (
    <section
      className="
    bg-pets bg-center py-6 overflow-hidden
    "
    >
      <div className="flex flex-col lg:flex-row">
        <div
          className="
 hidden xl:flex xl:w-[30%] xl:pl-[160px]
        "
        >
          <Image src={Badge} alt="badge-img" draggable="false" />
        </div>
        <div className="flex-1 py-5 gap-y-8 flex flex-col lg:flex-row lg:items-center">
          {/* selected Pets */}
          <div className="flex flex-col items-center flex-1  gap-2">
            <h1 className="text-white text-4xl font-bold text-center gap-1 flex items-center">
              {selectedPet.category}
              <span className="text-white text-xl font-normal">
                ({selectedPet.name})
              </span>
            </h1>
            <Image
              src={selectedPet.image}
              alt="selected pt"
              className="w-1/4 object-cover border-4 rounded-full"
              draggable="false"
            />
          </div>
          <div className="flex flex-wrap  gap-4 justify-evenly lg:justify-end flex-1  px-2 lg:px-5">
            {pets.map((pet) => {
              return (
                <div
                  className="relative cursor-pointer"
                  key={pet.id}
                  onClick={() => handleSelect(pet.id)}
                >
                  <div
                    className={`${
                      selectedPet.id !== pet.id && "bg-black/40"
                    } w-full absolute  h-full rounded-full`}
                  ></div>
                  <Image
                    src={pet.image}
                    width={95}
                    height={95}
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pets;
