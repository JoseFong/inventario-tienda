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
import { Product, User } from "@/generated/prisma";

function DeleteUser({
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
  const [loading, setLoading] = useState(false);

  async function deleteUser() {
    try {
      setLoading(true);
      const res = await axios.delete("/api/users/" + user.id);
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
          <AlertDialogTitle>
            ¿Está seguro que desea eliminar al usuario "{user.username}"?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            ¡Esta acción es permanente!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {loading ? (
            <Button variant={"destructive"} disabled>
              Eliminando...
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={deleteUser}>
              Eliminar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUser;
