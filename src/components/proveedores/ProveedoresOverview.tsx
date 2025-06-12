"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "@/generated/prisma";
import axios from "axios";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import CreateProvider from "./CreateProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import Add from "@/assets/addIcon.png";
import DeleteProvider from "./DeleteProvider";
import UpdateProvider from "./UpdateProvider";

function ProveedoresOverview() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<Provider[]>([]);

  const [openCreateProvider, setOpenCreateProvider] = useState(false);

  const [loading, setLoading] = useState(true);

  const [openDeleteProv, setOpenDeleteProv] = useState(false);
  const [selectedProv, setSelectedProv] = useState<Provider>();
  const [openUpdateProv, setOpenUpdateProv] = useState(false);

  async function fetchGetProviders() {
    try {
      setLoading(true);
      const res = await axios.get("/api/providers");
      setProviders(res.data);
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

  useEffect(() => {
    fetchGetProviders();
  }, []);

  useEffect(() => {
    setResults(providers);
  }, [providers]);

  useEffect(() => {
    if (searchValue.trim() !== "") {
      const aux: Provider[] = providers.filter((p: Provider) => {
        return (
          p.name.toLowerCase().includes(searchValue.toLowerCase().trim()) ||
          p.rfc.toLowerCase().includes(searchValue.toLowerCase().trim())
        );
      });
      setResults(aux);
    } else {
      setResults(providers);
    }
  }, [searchValue]);

  return (
    <div className="p-5 w-full flex flex-col gap-2 overflow-y-scroll max-h-screen">
      <div className="absolute -z-10">
        <CreateProvider
          open={openCreateProvider}
          setOpen={setOpenCreateProvider}
          fetchProviders={fetchGetProviders}
        />
        {selectedProv && (
          <>
            <DeleteProvider
              open={openDeleteProv}
              setOpen={setOpenDeleteProv}
              fetchProviders={fetchGetProviders}
              provider={selectedProv}
            />
            <UpdateProvider
              open={openUpdateProv}
              setOpen={setOpenUpdateProv}
              fetchProviders={fetchGetProviders}
              provider={selectedProv}
            />
          </>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-bold text-xl">Proveedores</h1>
        <Button
          onClick={() => setOpenCreateProvider(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Image className="w-6" src={Add} alt={"Registrar Proveedor"} />
          Registrar
        </Button>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <label>Buscar</label>
        <input
          className="bg-zinc-100 p-1 rounded-md"
          placeholder="Buscar Proveedor"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1 border-2">Proveedor</th>
                <th className="p-1 border-2">RFC</th>
                <th className="p-1 border-2">Lista de productos</th>
                <th className="p-1 border-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p: Provider) => (
                <tr key={p.id}>
                  <td className="p-1 border-2">{p.name}</td>
                  <td className="p-1 border-2">{p.rfc}</td>
                  <td className="p-1 border-2">Accion</td>
                  <td className="p-1 border-2">
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setSelectedProv(p);
                        setOpenUpdateProv(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setSelectedProv(p);
                        setOpenDeleteProv(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div className="w-full text-center">
              No se encontraron proveedores.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProveedoresOverview;
