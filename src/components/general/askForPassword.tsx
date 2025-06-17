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

function AskForPasswordModal({
  open,
  setOpen,
  openSecond,
}: {
  open: any;
  setOpen: any;
  openSecond: () => void;
}) {
  //useStates para form
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //useState para manejar aspectos visuales
  const [seePassword, setSeePassword] = useState(false);

  //Función que se ejecuta al presionar el botón
  async function checkPassword() {
    try {
      setLoading(true);
      if (isEmpty(password)) throw new Error("Complete todos los campos.");
      const data = {
        password: password.trim(),
      };
      const res = await axios.post("/api/checkPassword", data);
      setLoading(false);
      openSecond();
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
            Para continuar, ingrese su contraseña.
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            {seePassword ? (
              <input
                className="w-full bg-zinc-100 p-1 rounded-md"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : (
              <input
                type="password"
                className="w-full bg-zinc-100 p-1 rounded-md"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <div className="flex flex-row gap-1 items-center">
              <label>Mostrar contraseña</label>
              <input
                type="checkbox"
                checked={seePassword}
                onChange={() => setSeePassword(!seePassword)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {loading ? (
            <Button disabled>Cargando...</Button>
          ) : (
            <Button disabled={password === ""} onClick={checkPassword}>
              Aceptar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AskForPasswordModal;
