import ProductDashboard from "@/components/products/ProductDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import jwt from "jsonwebtoken";
import LateralMenu from "@/components/general/LateralMenu";

function Productos() {
  let decoded: any;
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) redirect("/login");
    console.log("hay algo");
    decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    console.log(decoded);
    if (decoded.type !== "superadmin" && decoded.type !== "admin")
      redirect("/login");
  } catch (e: any) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row">
      <LateralMenu session={decoded} />
      <ProductDashboard endpoint={"/api/productos"} specific={false} />
    </div>
  );
}

export default Productos;
