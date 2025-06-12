import React, { useEffect } from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import LateralMenu from "@/components/general/LateralMenu";
import TokenOverview from "@/components/token/TokenOverview";

function Tokens() {
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
      <TokenOverview />
    </div>
  );
}

export default Tokens;
