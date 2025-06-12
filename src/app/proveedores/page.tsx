import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import LateralMenu from "@/components/general/LateralMenu";
import ProveedoresOverview from "@/components/proveedores/ProveedoresOverview";

function Proveedores() {
  let decoded: any;
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) redirect("/login");
    decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (decoded.type !== "admin" && decoded.type !== "superadmin")
      redirect("/login");
  } catch (e: any) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row">
      <LateralMenu session={decoded} />
      <ProveedoresOverview />
    </div>
  );
}

export default Proveedores;
