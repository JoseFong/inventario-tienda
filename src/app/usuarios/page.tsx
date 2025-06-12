import UsersDashboard from "@/components/users/usersDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import jwt from "jsonwebtoken";
import LateralMenu from "@/components/general/LateralMenu";

async function Users() {
  let decoded: any;
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) redirect("/login");
    decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (decoded.type !== "superadmin") redirect("/login");
  } catch (e: any) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row">
      <LateralMenu session={decoded} />
      <UsersDashboard />
    </div>
  );
}

export default Users;
