"use client";
import { Customer } from "@/generated/prisma";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import CreateCustomer from "./CreateCustomer";
import { Button } from "../ui/button";
import UpdateCustomer from "./UpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";

function ClientesOverview() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [openCreateCus, setOpenCreateCus] = useState(false);

  const [selectedCus, setSelectedCus] = useState<Customer>();

  const [openUpdateCus, setOpenUpdateCus] = useState(false);

  const [openDeleteCus, setOpenDeleteCus] = useState(false);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await axios.get("/api/customers");
      setCustomers(res.data);
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
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setResults(customers);
    } else {
      const aux = customers.filter((c: Customer) => {
        return (
          c.name.toLowerCase().includes(search.trim().toLowerCase()) ||
          c.rfc.toLowerCase().includes(search.trim().toLowerCase())
        );
      });
      setResults(aux);
    }
  }, [search]);

  return (
    <div className="p-5 flex flex-col gap-2 w-full">
      <div className="absolute -z-10">
        <CreateCustomer
          open={openCreateCus}
          setOpen={setOpenCreateCus}
          fetchCustomers={fetchCustomers}
        />
        {selectedCus && (
          <>
            <UpdateCustomer
              open={openUpdateCus}
              setOpen={setOpenUpdateCus}
              fetchCustomers={fetchCustomers}
              customer={selectedCus}
            />
            <DeleteCustomer
              open={openDeleteCus}
              setOpen={setOpenDeleteCus}
              fetchCustomers={fetchCustomers}
              customer={selectedCus}
            />
          </>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-bold text-xl">Clientes</h1>
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() => setOpenCreateCus(true)}
        >
          Registrar
        </Button>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <label>Buscar</label>
        <input
          className="bg-zinc-100 p-1 rounded-md"
          placeholder="Buscar por nombre o RFC"
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
                <th className="p-1 border-2">RFC</th>
                <th className="p-1 border-2">Teléfono</th>
                <th className="p-1 border-2">Correo</th>
                <th className="p-1 border-2">Dirección</th>
                <th className="p-1 border-2">Compras</th>
                <th className="p-1 border-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c: Customer) => (
                <tr>
                  <td className="p-1 border-2 text-start">{c.name}</td>
                  <td className="p-1 border-2 text-start">{c.rfc}</td>
                  <td className="p-1 border-2 text-start">{c.phone}</td>
                  <td className="p-1 border-2 text-start">{c.email}</td>
                  <td className="p-1 border-2 text-start">{c.address}</td>
                  <td className="p-1 border-2 text-start">
                    <p className="text-red-500 font-bold">PENDIENTE</p>
                  </td>
                  <td className="p-1 border-2 text-start">
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        setSelectedCus(c);
                        setOpenUpdateCus(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setSelectedCus(c);
                        setOpenDeleteCus(true);
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
              No se encontraron resultados.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClientesOverview;
