import ProductDashboard from "@/components/products/ProductDashboard";
import React from "react";

function HomePage() {
  return (
    <div className="p-5 flex flex-col gap-2">
      <ProductDashboard />
    </div>
  );
}

export default HomePage;
