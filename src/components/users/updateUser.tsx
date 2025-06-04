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
import { isEmpty, validPassword } from "@/utils/validatons";
import { Product, User } from "@/generated/prisma";

function UpdateUser({
  open,
  setOpen,
  fetchUsers,
  user,
}: {
  open: any;
  setOpen: any;
  fetchUsers: () => void;
  user: User;
}) {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState(user.type);

  const usernameinit = user.username;
  const typeinit = user.type;

  const [loading, setLoading] = useState(false);

  const [seePassword, setSeePassword] = useState(false);

  function reset() {
    setUsername(user.username);
    setPassword("");
    setConfirmPassword("");
    setSeePassword(false);
    setType(user.type);
  }

  useEffect(() => {
    reset();
  }, [open]);

  async function updateUser() {
    try {
      setLoading(true);
      if (isEmpty(username.trim()))
        throw new Error("Complete todos los campos.");

      if (type === "ninguno") throw new Error("Seleccione un tipo de usuario.");

      const data = {
        username: username.trim(),
        type: type,
      };

      const res = await axios.patch("/api/users/" + user.id, data);
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

  async function updatePassword() {
    try {
      setLoading(true);
      if (isEmpty(password) || isEmpty(confirmPassword))
        throw new Error("Ingrese la nueva contraseña.");

      if (password.trim().length < 8)
        throw new Error("Su contraseña debe de tener al menos 8 caracteres.");

      if (!validPassword(password.trim()))
        throw new Error(
          "Su contraseña debe de contener una mayúscula, una minúscula y un número."
        );

      if (password.trim() !== confirmPassword.trim())
        throw new Error("Sus contraseñas no coinciden.");

      const data = {
        password: password.trim(),
      };

      const res = await axios.put("/api/users/" + user.id, data);
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
          <AlertDialogTitle>Editar Usuario "{user.username}"</AlertDialogTitle>
          <AlertDialogDescription className="text-black flex flex-col gap-1 items-start max-h-[400px] overflow-y-scroll">
            <h1 className="font-bold text-lg">
              Editar Información del Usuario
            </h1>
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
            {loading ? (
              <Button className="w-full mt-2" disabled>
                Editando...
              </Button>
            ) : (
              <Button
                disabled={username === usernameinit && typeinit === type}
                className="w-full mt-2"
                onClick={updateUser}
              >
                Editar
              </Button>
            )}
            <h1 className="font-bold text-lg mt-3 border-t-2 w-full text-start pt-3 border-black">
              Cambiar contraseña
            </h1>
            <label>Nueva contraseña</label>
            {seePassword ? (
              <input
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : (
              <input
                type="password"
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <label>Confirmar nueva contraseña</label>
            {seePassword ? (
              <input
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            ) : (
              <input
                type="password"
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Confirmar nueva contraseña"
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
            {loading ? (
              <Button className="w-full mt-2" disabled>
                Editando...
              </Button>
            ) : (
              <Button
                disabled={confirmPassword === "" || password === ""}
                className="w-full mt-2"
                onClick={updatePassword}
              >
                Cambiar contraseña
              </Button>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateUser;
