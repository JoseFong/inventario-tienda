import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { Token } from "@/generated/prisma";

function CreateProvider({
  open,
  setOpen,
  fetchProviders,
}: {
  open: any;
  setOpen: any;
  fetchProviders: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [rfc, setRfc] = useState("");

  async function fetchCreateProvider() {
    try {
      if (name.trim() === "" || rfc.trim() === "")
        throw new Error("Complete todos los campos.");

      const data = {
        name: name.trim(),
        rfc: rfc.trim(),
      };

      const res = await axios.post("/api/providers", data);
      setLoading(false);
      reset();
      fetchProviders();
      setOpen(false);
    } catch (e: any) {
      setLoading(false);
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  function reset() {
    setName("");
    setRfc("");
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar Proveedor</AlertDialogTitle>
          <AlertDialogDescription className="text-black flex flex-col gap-1 items-start w-full">
            <label>Nombre</label>
            <input
              className="w-full bg-zinc-100 p-1 rounded-md"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>RFC</label>
            <input
              className="w-full bg-zinc-100 p-1 rounded-md"
              placeholder="RFC"
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          {loading ? (
            <Button disabled>Registrando...</Button>
          ) : (
            <Button
              onClick={fetchCreateProvider}
              disabled={name.trim() === "" || rfc.trim() === ""}
            >
              Registrar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateProvider;
