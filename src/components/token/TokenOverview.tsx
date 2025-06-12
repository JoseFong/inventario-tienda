"use client";
import { Token } from "@/generated/prisma";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import GenerateToken from "./GenerateToken";
import addIcon from "@/assets/addIcon.png";
import Image from "next/image";
import { Button } from "../ui/button";
import DeleteToken from "./DeleteToken";

function TokenOverview() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Token[]>([]);

  const [openDeleteToken, setOpenDeleteToken] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>();

  const [openAddTokenModal, setOpenAddTokenModal] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  async function fetchGetTokens() {
    try {
      setLoading(true);
      const res = await axios.get("/api/tokens");
      setTokens(res.data);
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
    if (searchValue.trim() !== "") {
      const aux: Token[] = tokens.filter((t: Token) => {
        return (
          t.value.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
          t.entity.toLowerCase().includes(searchValue.trim().toLowerCase())
        );
      });
      setResults(aux);
    } else {
      setResults(tokens);
    }
  }, [searchValue]);

  useEffect(() => {
    fetchGetTokens();
  }, []);

  return (
    <div className="p-5 w-full flex flex-col gap-2 overflow-y-scroll max-h-screen">
      <div className="absolute -z-10">
        <GenerateToken
          open={openAddTokenModal}
          setOpen={setOpenAddTokenModal}
          fetchTokens={fetchGetTokens}
        />
        {selectedToken && (
          <>
            <DeleteToken
              open={openDeleteToken}
              setOpen={setOpenDeleteToken}
              fetchTokens={fetchGetTokens}
              tokenX={selectedToken}
            />
          </>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-bold text-xl">Tokens</h1>
        <Button
          className="bg-green-500 p-1 px-3 hover:bg-green-600"
          onClick={() => setOpenAddTokenModal(true)}
        >
          <Image src={addIcon} alt="Agregar Token" className="w-6" />
          Agregar
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center w-full">
        <label>Buscar</label>
        <input
          className="bg-zinc-100 p-1 rounded-md"
          placeholder="Buscar token"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      {loading ? (
        <>
          <Skeleton className="w-full h-10 mb-1" />
          <Skeleton className="w-full h-8 mb-1" />
          <Skeleton className="w-full h-8 mb-1" />
          <Skeleton className="w-full h-8 mb-1" />
          <Skeleton className="w-full h-8 mb-1" />
        </>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1 border-2">Token</th>
                <th className="p-1 border-2">Entidad</th>
                <th className="p-1 border-2">Permisos</th>
                <th className="p-1 border-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((t: Token) => (
                <tr key={t.id}>
                  <td className="p-1 border-2">{t.value}</td>
                  <td className="p-1 border-2">{t.entity}</td>
                  <td className="p-1 border-2">{t.permits}</td>
                  <td className="p-1 border-2">
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setSelectedToken(t);
                        setOpenDeleteToken(true);
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
            <div className="w-full text-center mt-3">
              No se encontraron tokens.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TokenOverview;
