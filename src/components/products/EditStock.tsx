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
import axios from "axios";
import toast from "react-hot-toast";
import { Product } from "@/generated/prisma";

function EditStock({
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
  const [stock, setStock] = useState<any>(product.stock);

  const initstock = product.stock;

  async function editStock() {
    try {
      setLoading(true);

      const data = {
        sku: product.sku,
        name: product.name,
        price: product.price,
        hasVariants: product.hasVariants,
        stock: parseInt(stock),
        pictureUrl: product.pictureUrl,
        providerId: product.providerId,
      };

      const res = await axios.patch("/api/productos/" + product.id, data);
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
          <AlertDialogTitle>Editar Stock de {product.name}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-1 text-black">
            <label>Stock</label>
            <input
              className="w-full bg-zinc-100 p-1 rounded-md"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {loading ? (
            <Button disabled>Editando...</Button>
          ) : (
            <Button
              disabled={parseInt(initstock + "") === parseInt(stock + "")}
              onClick={editStock}
            >
              Editar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditStock;
