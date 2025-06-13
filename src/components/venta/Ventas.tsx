"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/generated/prisma";
import axios from "axios";
import toast from "react-hot-toast";

function VentasDashboard() {
  type P = {
    product: Product;
    quant: number;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [focused, setFocused] = useState(false);

  const [list, setList] = useState<P[]>([]);

  async function fetchProducts() {
    try {
      console.log("vas a hacer la peticion.");
      const res = await axios.get("/api/productos");
      setProducts(res.data);
      setResults(res.data);
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  function addProduct(product: Product) {
    const aux: P[] = [...list];
    const aux2: P = {
      product: product,
      quant: 1,
    };
    aux.push(aux2);
    setList(aux);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setResults(products);
    } else {
      const aux = products.filter((p: Product) => {
        return (
          p.name.toLowerCase().includes(search.trim().toLowerCase()) ||
          p.sku.toLowerCase().includes(search.trim().toLowerCase())
        );
      });
      setResults(aux);
    }
  }, [search]);

  return (
    <div className="p-5 w-full flex flex-col gap-1">
      <h1 className="font-bold text-xl">Venta</h1>
      <div className="relative w-full z-1">
        <input
          className="bg-zinc-100 p-1 rounded-md w-full z-0"
          placeholder="Buscar por Nombre o SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
        />
        {focused && (
          <div className="bg-zinc-100 absolute w-full mt-1 p-1 flex flex-col gap-1 items-start rounded-md z-1">
            {results.map((p: Product) => (
              <button
                onMouseDown={() => addProduct(p)}
                className="bg-zinc-200 w-full p-1 rounded-md text-start hover:bg-zinc-300 active:bg-zinc-400"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <h1 className="font-bold text-lg">Productos</h1>
      <div className="bg-zinc-100 rounded-md p-1">Hola</div>
      {list.map((l: P) => (
        <div>
          {l.product.name} {l.quant}
        </div>
      ))}
    </div>
  );
}

export default VentasDashboard;
