"use client";
import React, { useState } from "react";
import Image from "next/image";
import Hamburger from "@/assets/icons8-hamburger-menu-100.png";
import Exit from "@/assets/icons8-close-90 (1).png";

function MenuTest() {
  const [active, setActive] = useState(false);

  return (
    <div className="bg-blue-500 h-screen min-w-12 p-1 justify-center text-center">
      <button
        onClick={() => setActive(!active)}
        className="p-2 hover:bg-blue-600 rounded-md active:bg-blue-700"
      >
        <Image src={Hamburger} alt="Menú" />
      </button>
      {active && (
        <button
          onClick={() => setActive(!active)}
          className="bg-black/10 inset-0 absolute backdrop-blur-sm"
        />
      )}
      <div
        className={`bg-blue-500 absolute top-0 text-white left-0 shadow-2xl h-screen p-3 transition ease-in-out ${
          active ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setActive(!active)}
          className="w-6 absolute top-3 right-3"
        >
          <Image src={Exit} alt="Cerrar" />
        </button>

        <h1 className="text-2xl w-4/5 font-bold">ESTE ES EL MENU</h1>
      </div>
    </div>
  );
}

export default MenuTest;
