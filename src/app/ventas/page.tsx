import { redirect } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LateralMenu from "@/components/general/LateralMenu";
import VentasDashboard from "@/components/venta/Ventas";

function Ventas() {
  let session: any;

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) redirect("/login");
    session = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (!session.type) redirect("/login");
  } catch (e: any) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row">
      <LateralMenu session={session} />
      <VentasDashboard />
    </div>
  );
}

export default Ventas;
