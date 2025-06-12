import React, { useEffect, useState } from "react";
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
import { Provider } from "@/generated/prisma";

function UpdateProvider({
  open,
  setOpen,
  fetchProviders,
  provider,
}: {
  open: any;
  setOpen: any;
  fetchProviders: () => void;
  provider: Provider;
}) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(provider.name);
  const [rfc, setRfc] = useState(provider.rfc);

  const nameinit = provider.name;
  const rfcinit = provider.rfc;

  async function fetchUpdateProvider() {
    try {
      setLoading(true);
      if (name.trim() === "" || rfc.trim() === "")
        throw new Error("Complete todos los campos.");

      const data = {
        name: name.trim(),
        rfc: rfc.trim(),
      };

      const res = await axios.patch("/api/providers/" + provider.id, data);
      setLoading(false);
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
    setName(provider.name);
    setRfc(provider.rfc);
  }

  useEffect(() => {
    reset();
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Proveedor</AlertDialogTitle>
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
            <Button disabled>Editando...</Button>
          ) : (
            <Button
              onClick={fetchUpdateProvider}
              disabled={name === nameinit && rfc === rfcinit}
            >
              Editar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateProvider;
