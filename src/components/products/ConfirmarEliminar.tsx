import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { isEmpty } from "@/utils/validatons";
import { Product } from "@/generated/prisma";

function ConfirmarEliminar({
  open,
  setOpen,
  fetchProducts,
  product,
}: {
  open: any;
  setOpen: any;
  fetchProducts: () => void;
  product: Product;
}) {
  const [loading, setLoading] = useState(false);

  async function deleteProduct() {
    try {
      setLoading(true);
      const res = await axios.delete("/api/products/" + product.id);
      fetchProducts();
      setLoading(false);
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
            ¿Está seguro que quiere eliminar el producto {product.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            ¡Esta acción es permanente!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {loading ? (
            <Button disabled variant={"destructive"}>
              Eliminando...
            </Button>
          ) : (
            <Button onClick={deleteProduct} variant={"destructive"}>
              Eliminar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmarEliminar;
