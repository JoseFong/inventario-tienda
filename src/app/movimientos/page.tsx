import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import LateralMenu from "@/components/general/LateralMenu";
import VentasOverview from "@/components/movimientos/VentasOverview";
import SalidasOverview from "@/components/movimientos/SalidasOverview";

function Movimientos() {
  let session: any;
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) redirect("/login");
    session = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (
      session.type !== "admin" &&
      session.type !== "superadmin" &&
      session.type !== "empleado"
    )
      redirect("/login");
  } catch (e: any) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row">
      <LateralMenu session={session} />
      <div className="flex flex-row w-full">
        <div className="w-1/2">
          <VentasOverview />
        </div>
        <div className="w-1/2">
          <SalidasOverview />
        </div>
      </div>
    </div>
  );
}

export default Movimientos;
