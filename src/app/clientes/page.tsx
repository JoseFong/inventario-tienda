import { cookies } from "next/headers";
import React from "react";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import LateralMenu from "@/components/general/LateralMenu";
import ClientesOverview from "@/components/clientes/ClientesOverview";

function ClientesPage() {
  let session: any;
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) redirect("/login");
    session = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (session.type !== "admin" && session.type !== "superadmin")
      redirect("/login");
  } catch (e: any) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row">
      <LateralMenu session={session} />
      <ClientesOverview />
    </div>
  );
}

export default ClientesPage;
