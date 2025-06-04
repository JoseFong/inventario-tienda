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
import { isEmpty, validPassword } from "@/utils/validatons";
import { Product } from "@/generated/prisma";

function RegisterUser({
  open,
  setOpen,
  fetchUsers,
}: {
  open: any;
  setOpen: any;
  fetchUsers: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("ninguno");

  const [loading, setLoading] = useState(false);

  const [seePassword, setSeePassword] = useState(false);

  function reset() {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setSeePassword(false);
    setType("ninguno");
  }

  async function register() {
    try {
      setLoading(true);
      if (
        isEmpty(username.trim()) ||
        isEmpty(password.trim()) ||
        isEmpty(confirmPassword.trim())
      )
        throw new Error("Complete todos los campos.");

      if (type === "ninguno") throw new Error("Seleccione un tipo de usuario.");

      if (password.trim().length < 8)
        throw new Error("Su contraseña debe de tener al menos 8 caracteres.");

      if (!validPassword(password.trim()))
        throw new Error(
          "Su contraseña debe de contener una mayúscula, una minúscula y un número."
        );

      if (password.trim() !== confirmPassword.trim())
        throw new Error("Sus contraseñas no coinciden.");

      const data = {
        username: username.trim(),
        type: type,
        password: password.trim(),
      };

      const res = await axios.post("/api/users", data);
      reset();
      fetchUsers();
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
          <AlertDialogTitle>Registrar Usuario</AlertDialogTitle>
          <AlertDialogDescription className="text-black flex flex-col gap-1 items-start">
            <label>Nombre de usuario</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Tipo</label>
            <select
              className="bg-zinc-100 p-1 rounded-md w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-placeholder="Seleccione un tipo"
            >
              <option value={"ninguno"}>Seleccione un tipo</option>
              <option value={"empleado"}>Empleado</option>
              <option value={"admin"}>Administrador</option>
              <option value={"superadmin"}>SuperAdmin</option>
            </select>
            <label>Contraseña</label>
            {seePassword ? (
              <input
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : (
              <input
                type="password"
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <label>Confirmar contraseña</label>
            {seePassword ? (
              <input
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            ) : (
              <input
                type="password"
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Button disabled>Registrando...</Button>
          ) : (
            <Button onClick={register}>Registrar</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RegisterUser;
