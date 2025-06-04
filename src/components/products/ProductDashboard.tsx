"use client";
import { Product } from "@/generated/prisma";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import addIcon from "@/assets/addIcon.png";
import Image from "next/image";
import CreateProductModal from "./CreateProductModal";
import ConfirmarEliminar from "./ConfirmarEliminar";
import { Skeleton } from "../ui/skeleton";

function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [loading, setLoading] = useState(true);

  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);

  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  function openDeleteModal(product: Product) {
    setSelectedProduct(product);
    setOpenDeleteProductModal(true);
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setResults(products);
    setLoading(false);
  }, [products]);

  useEffect(() => {
    if (searchValue === "") {
      setResults(products);
    } else {
      const aux: Product[] = products.filter((p: Product) => {
        return (
          p.name.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
          p.sku.toString().includes(searchValue.trim())
        );
      });
      setResults(aux);
    }
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-1">
      <div className="z-0 absolute">
        <CreateProductModal
          open={openCreateProductModal}
          setOpen={setOpenCreateProductModal}
          fetchProducts={fetchProducts}
        />
        {selectedProduct && (
          <ConfirmarEliminar
            open={openDeleteProductModal}
            setOpen={setOpenDeleteProductModal}
            fetchProducts={fetchProducts}
            product={selectedProduct}
          />
        )}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-bold text-xl">Todos los productos</h1>
        <Button
          disabled={loading}
          onClick={() => setOpenCreateProductModal(true)}
          className="w-auto self-start px-3 py-5 bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
        >
          <Image src={addIcon} alt={"Agregar Producto"} className="w-8" />
          Agregar
        </Button>
      </div>
      {loading ? (
        <>
          <Skeleton className="w-full h-10 my-5" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </>
      ) : (
        <>
          <div className="flex flex-row gap-3 items-center w-full my-2">
            <label className="text-lg">Buscar producto</label>
            <input
              className="text-lg p-2 border-md bg-zinc-100 rounded-lg flex-grow"
              placeholder="Buscar producto"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th className="p-1">Imágen</th>
                <th className="p-1 text-start">SKU</th>
                <th className="p-1 text-start">Nombre</th>
                <th className="p-1 text-start">Stock</th>
                <th className="p-1 text-start">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p: Product) => (
                <tr key={p.id}>
                  <td className="p-1 flex justify-center">
                    <a href={p.pictureUrl + ""} target="_blank">
                      <img src={p.pictureUrl + ""} className="w-16" />
                    </a>
                  </td>
                  <td className="p-1 justify-center">{p.sku}</td>
                  <td className="p-1 justify-center">{p.name}</td>
                  <td className="p-1 justify-center">{p.stock}</td>
                  <td className="p-1 justify-center">
                    <Button
                      variant={"destructive"}
                      onClick={() => openDeleteModal(p)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div className="text-center text-lg mt-3">
              No se encontraron resultados
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductDashboard;
