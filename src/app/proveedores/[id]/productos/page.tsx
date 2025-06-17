import { cookies } from "next/headers";
import React from "react";
import jwt from "jsonwebtoken";
import { redirect, useSearchParams } from "next/navigation";
import LateralMenu from "@/components/general/LateralMenu";
import ProductDashboard from "@/components/products/ProductDashboard";

interface Props {
  params: {
    id: string;
  };
}

function ProductosDeProveedorPage({ params }: Props) {
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
      <ProductDashboard
        endpoint={"/api/productos?providerId=" + params.id}
        specific={true}
      />
    </div>
  );
}

export default ProductosDeProveedorPage;
