import React, { useEffect, useState } from "react";
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

function GenerateToken({ open, setOpen }: { open: any; setOpen: any }) {
  let permits = "";

  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState("none");
  const [create, setCreate] = useState(false);
  const [read, setRead] = useState(false);
  const [update, setUpdate] = useState(false);
  const [del, setDel] = useState(false);

  async function getToken() {
    try {
      if (entity === "none") throw new Error("Seleccione una entidad.");

      if (!create && !read && !update && !del)
        throw new Error("Seleccione por lo menos un permiso.");

      alert("ESO TILIN");
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Token de Acceso</AlertDialogTitle>
          <AlertDialogDescription className="text-black flex-col gap-1 items-start">
            <label>Entidad</label>
            <select
              className="w-full bg-zinc-100 p-1 rounded-md"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
            >
              <option value="none">Seleccione una opción</option>
              <option value="user">Usuarios</option>
              <option value="product">Producto</option>
              <option value="provider">Proveedor</option>
              <option value="movement">Movimiento</option>
            </select>
            <label>Permisos:</label>
            <div className="flex-row gap-5">
              <div className="flex-row flex gap-1 items-center">
                <label>Crear</label>
                <input
                  type="checkbox"
                  checked={create}
                  onChange={() => setCreate(!create)}
                />
              </div>
              <div className="flex-row flex gap-1 items-center">
                <label>Editar</label>
                <input
                  type="checkbox"
                  checked={update}
                  onChange={() => setUpdate(!update)}
                />
              </div>
            </div>
            <div className="flex-row gap-5">
              <div className="flex-row flex gap-1 items-center">
                <label>Leer</label>
                <input
                  type="checkbox"
                  checked={read}
                  onChange={() => setRead(!read)}
                />
              </div>
              <div className="flex-row flex gap-1 items-center">
                <label>Eliminar</label>
                <input
                  type="checkbox"
                  checked={del}
                  onChange={() => setDel(!del)}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <Button onClick={getToken}>Generar Token</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default GenerateToken;
