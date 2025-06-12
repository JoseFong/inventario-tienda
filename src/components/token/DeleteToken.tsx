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

function DeleteToken({
  open,
  setOpen,
  fetchTokens,
  tokenX,
}: {
  open: any;
  setOpen: any;
  fetchTokens: () => void;
  tokenX: Token;
}) {
  const [loading, setLoading] = useState(false);

  async function fetchDeleteToken() {
    try {
      setLoading(true);
      const res = await axios.delete("/api/tokens/" + tokenX.id);
      setLoading(false);
      fetchTokens();
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
            ¿Está seguro que desea eliminar el token?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            ¡Esta acción es permanente, sus aplicaciones que usen este token
            dejarán de funcionar!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          {loading ? (
            <Button variant={"destructive"} disabled>
              Eliminando...
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={fetchDeleteToken}>
              Eliminar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteToken;
