"use client";
import React, { useState } from "react";
import Image from "next/image";
import Hamburger from "@/assets/icons8-hamburger-menu-100.png";
import Close from "@/assets/icons8-close-90 (1).png";
import Logout from "@/assets/icons8-logout-100.png";
import Users from "@/assets/icons8-user-90.png";
import Providers from "@/assets/icons8-provider-100.png";
import Products from "@/assets/icons8-product-100.png";
import Movements from "@/assets/icons8-transactions-64.png";
import Sales from "@/assets/icons8-sales-96.png";
import Config from "@/assets/icons8-config-100.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Token from "@/assets/icons8-tokens-64.png";

function LateralMenu({ session }: { session: any }) {
  const [showing, setShowing] = useState(false);
  const router = useRouter();

  async function logOut() {
    try {
      const res = await axios.get("/api/login");
      router.push("/login");
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  return (
    <div className="bg-blue-600 h-screen p-1 items-center min-w-12">
      <button
        onClick={() => setShowing(!showing)}
        className="hover:bg-blue-700 p-2 rounded-md hover:shadow-md active:bg-blue-800"
      >
        <Image src={Hamburger} alt="Menú" className="w-6" />
      </button>
      {showing && (
        <button
          onClick={() => setShowing(!showing)}
          className="bg-black opacity-30 z-1 absolute inset-0"
        ></button>
      )}

      <div
        className={`bg-blue-600 h-screen shadow-lg absolute left-0 top-0 transition-transform ease-in-out text-white ${
          showing ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 w-full p-6 h-full relative">
          <button
            onClick={() => setShowing(!showing)}
            className="w-6 absolute right-3 top-3"
          >
            <Image src={Close} alt="Cerrar" />
          </button>
          <div className="mb-6 flex flex-row gap-3 mr-6 items-center">
            <h2 className="font-bold text-xl">
              Bienvenido, {session.username}
            </h2>
            <button className="w-6" onClick={logOut}>
              <Image src={Logout} alt="Cerrar Sesión" />
            </button>
          </div>
          <a
            href="/ventas"
            className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1"
          >
            <Image src={Sales} alt="Ventas" className="w-8" />
            <h1 className="text-lg font-bold">Venta</h1>
          </a>
          {(session.type === "superadmin" || session.type === "admin") && (
            <a
              href="/proveedores"
              className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1"
            >
              <Image src={Providers} alt="Proveedores" className="w-8" />
              <h1 className="text-lg font-bold">Proveedores</h1>
            </a>
          )}

          {(session.type === "admin" || session.type === "superadmin") && (
            <a
              href="/productos"
              className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1"
            >
              <Image src={Products} alt="Productos" className="w-8" />
              <h1 className="text-lg font-bold">Productos</h1>
            </a>
          )}
          {session.type === "superadmin" && (
            <a
              href="/usuarios"
              className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1"
            >
              <Image src={Users} alt="Ventas" className="w-8" />
              <h1 className="text-lg font-bold">Usuarios</h1>
            </a>
          )}
          {(session.type === "admin" || session.type === "superadmin") && (
            <a
              href="/movimientos"
              className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1"
            >
              <Image src={Movements} alt="Movimientos" className="w-8" />
              <h1 className="text-lg font-bold">Movimientos</h1>
            </a>
          )}
          {session.type === "superadmin" && (
            <a
              href="/tokens"
              className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1"
            >
              <Image src={Token} alt="Tokens" className="w-8" />
              <h1 className="text-lg font-bold">Tokens</h1>
            </a>
          )}
          {(session.type === "admin" || session.type === "superadmin") && (
            <button className="hover:bg-blue-700 hover:shadow-md active:bg-blue-800 rounded-md p-1 items-center flex flex-row gap-1">
              <Image src={Config} alt="Configuración" className="w-8" />
              <h1 className="text-lg font-bold">Configuración</h1>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LateralMenu;
