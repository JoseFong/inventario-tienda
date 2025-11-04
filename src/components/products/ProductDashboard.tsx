"use client";
import { Product, Provider, Variation } from "@/generated/prisma";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import ConfirmarEliminar from "./ConfirmarEliminar";
import { Skeleton } from "../ui/skeleton";
import CreateProduct from "./CreateProduct";
import Image from "next/image";
import DeleteVariant from "./DeleteVariant";
import CreateVariant from "./CreateVariant";

function ProductDashboard({
  endpoint,
  specific,
}: {
  endpoint: any;
  specific: any;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [variants, setVariants] = useState<Variation[]>([]);
  const [search, setSearch] = useState("");
  const [varResults, setVarResults] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const [openDelProd, setOpenDelProd] = useState(false);
  const [openCreateProd, setOpenCreateProd] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<Variation>();
  const [openDelVar, setOpenDelVar] = useState(false);

  const [openCreateVar, setOpenCreateVar] = useState(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get("/api/productos");
      setProducts(res.data);
      setResults(res.data);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  async function fetchVariations() {
    try {
      setLoading(true);
      const res = await axios.get("/api/variants");
      setVariants(res.data);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  async function fetchProviders() {
    try {
      setLoading(true);
      const res = await axios.get("/api/providers");
      setProviders(res.data);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchVariations();
    fetchProviders();
  }, []);

  function getProviderName(id: number) {
    const provider = providers.find(
      (p: Provider) => parseInt(p.id + "") === parseInt(id + "")
    );
    if (provider) return provider.name;
    return "Desconocido";
  }

  function showRow(id: number) {
    if (expandedRows.includes(id)) {
      const aux = expandedRows.filter((x: number) => x !== id);
      setExpandedRows(aux);
    } else {
      const aux = [...expandedRows];
      aux.push(id);
      setExpandedRows(aux);
    }
  }

  useEffect(() => {
    if (search.trim() === "") {
      setResults(products);
      setVarResults(variants);
    } else {
      const aux1 = products.filter((p: Product) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
      setResults(aux1);

      const aux2 = variants.filter((v: Variation) => {
        return (
          v.sku.toLowerCase().includes(search.trim().toLowerCase()) ||
          v.name.toLowerCase().includes(search.trim().toLowerCase())
        );
      });
      setVarResults(aux2);
    }
  }, [search]);

  function reset() {
    fetchProducts();
    fetchVariations();
  }

  return (
    <div className="p-5 w-full flex flex-col gap-2 max-h-screen overflow-y-scroll">
      <div className="-z-10 absolute">
        {selectedProduct && (
          <>
            <ConfirmarEliminar
              open={openDelProd}
              setOpen={setOpenDelProd}
              fetchProducts={reset}
              product={selectedProduct}
            />
            <CreateVariant
              open={openCreateVar}
              setOpen={setOpenCreateVar}
              fetchProducts={reset}
              product={selectedProduct}
            />
          </>
        )}
        {selectedVariant && (
          <DeleteVariant
            open={openDelVar}
            setOpen={setOpenDelVar}
            fetchProducts={reset}
            variant={selectedVariant}
          />
        )}
        <CreateProduct
          open={openCreateProd}
          setOpen={setOpenCreateProd}
          fetchProducts={reset}
          providers={providers}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <h1 className="font-bold text-xl">Productos</h1>
        <Button
          onClick={() => setOpenCreateProd(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          Registrar
        </Button>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <label>Buscar</label>
        <input
          disabled={loading}
          className="p-1 bg-zinc-100 rounded-md"
          placeholder="Buscar por Nombre o SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <>
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th className="p-1 border-2">Nombre</th>
                <th className="p-1 border-2">Proveedor</th>
                <th className="p-1 border-2">Variantes</th>
                <th className="p-1 border-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p: Product) => (
                <>
                  <tr>
                    <td className="p-1 border-2">{p.name}</td>
                    <td className="p-1 border-2">
                      {getProviderName(p.providerId)}
                    </td>
                    <td className="p-1 border-2">
                      {expandedRows.includes(p.id) ? (
                        <Button onClick={() => showRow(p.id)} variant={"link"}>
                          Ocultar
                        </Button>
                      ) : (
                        <Button variant={"link"} onClick={() => showRow(p.id)}>
                          {p.hasVariants ? "Ver variantes" : "Ver única"}
                        </Button>
                      )}
                    </td>
                    <td className="p-1 border-2">
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          setSelectedProduct(p);
                          setOpenDelProd(true);
                        }}
                      >
                        Eliminar
                      </Button>
                      {p.hasVariants && (
                        <Button
                          className="ml-1"
                          onClick={() => {
                            setSelectedProduct(p);
                            setOpenCreateVar(true);
                          }}
                        >
                          Registrar Variante
                        </Button>
                      )}
                    </td>
                  </tr>
                  {expandedRows.includes(p.id) && (
                    <tr>
                      <td colSpan={4} className="border-2 p-2 bg-zinc-100">
                        {variants.filter((v: Variation) => v.productId === p.id)
                          .length === 0 ? (
                          <p>No se encontraron variantes.</p>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="font-bold p-1 border-2">
                                  Imágen
                                </th>
                                <th className="font-bold p-1 border-2">
                                  Variante
                                </th>
                                <th className="font-bold p-1 border-2">SKU</th>
                                <th className="font-bold p-1 border-2">
                                  Precio Unitario
                                </th>
                                <th className="font-bold p-1 border-2">
                                  Stock
                                </th>
                                <th className="font-bold p-1 border-2">
                                  Acciones
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {variants
                                .filter((v: Variation) => v.productId === p.id)
                                .map((v: Variation) => (
                                  <tr>
                                    <td className="p-1 border-2">
                                      <img
                                        src={v.pictureUrl + ""}
                                        className="w-16"
                                      />
                                    </td>
                                    <td className="p-1 border-2">{v.name}</td>
                                    <td className="p-1 border-2">{v.sku}</td>
                                    <td className="p-1 border-2">{v.price}</td>
                                    <td className="p-1 border-2">{v.stock}</td>
                                    <td className="p-1 border-2">
                                      {p.hasVariants && (
                                        <Button
                                          variant={"destructive"}
                                          onClick={() => {
                                            setSelectedVariant(v);
                                            setOpenDelVar(true);
                                          }}
                                        >
                                          Eliminar
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div className="w-full text-center">
              No se encontraron productos.
            </div>
          )}
          {search.trim() !== "" && (
            <>
              <h1 className="font-bold text-xl">Variantes</h1>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="font-bold p-1 border-2">Imágen</th>
                    <th className="font-bold p-1 border-2">Variante</th>
                    <th className="font-bold p-1 border-2">SKU</th>
                    <th className="font-bold p-1 border-2">Precio Unitario</th>
                    <th className="font-bold p-1 border-2">Stock</th>
                    <th className="font-bold p-1 border-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {varResults.map((v: Variation) => (
                    <tr>
                      <td className="p-1 border-2">
                        <img src={v.pictureUrl + ""} className="w-16" />
                      </td>

                      <td className="p-1 border-2">{v.name}</td>
                      <td className="p-1 border-2">{v.sku}</td>
                      <td className="p-1 border-2">{v.price}</td>
                      <td className="p-1 border-2">{v.stock}</td>
                      <td className="p-1 border-2">
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            setSelectedVariant(v);
                            setOpenDelVar(true);
                          }}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {varResults.length === 0 && (
                <div className="w-full text-center">
                  No se encontraron variantes.
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProductDashboard;
