import ProductDashboard from "@/components/products/ProductDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import jwt from "jsonwebtoken";

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
    <div className="p-5">
      <ProductDashboard />
    </div>
  );
}

export default Productos;
