import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import jwt from "jsonwebtoken";
import LateralMenu from "@/components/general/LateralMenu";

function RegistrarVentaPage() {
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
      RegistrarVentaPage
    </div>
  );
}

export default RegistrarVentaPage;
