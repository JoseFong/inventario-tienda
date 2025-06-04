import UsersDashboard from "@/components/users/usersDashboard";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

async function Users() {
  let decoded: any;
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("storeUser");
    if (!cookie) {
      redirect("/login");
    }
    decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);

    if (decoded.type !== "superadmin") {
      redirect("/login");
    }
  } catch (e: any) {
    redirect("/login");
  }

  return <UsersDashboard sysUser={decoded} />;
}

export default Users;
