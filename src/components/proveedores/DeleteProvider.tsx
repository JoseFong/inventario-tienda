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
import { Provider } from "@/generated/prisma";

function DeleteProvider({
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

  async function fetchDeleteProvider() {
    try {
      setLoading(true);
      const res = await axios.delete("/api/providers/" + provider.id);
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Eliminar Proveedor {provider.name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            ¡Esta acción es permanente, se eliminarán todos los productos
            relacionados a este proveedor!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          {loading ? (
            <Button variant={"destructive"} disabled>
              Eliminando...
            </Button>
          ) : (
            <Button onClick={fetchDeleteProvider} variant={"destructive"}>
              Eliminar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteProvider;
