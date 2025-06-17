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
import { isEmpty, validMail } from "@/utils/validatons";
import { Provider } from "@/generated/prisma";

function CreateCustomer({
  open,
  setOpen,
  fetchCustomers,
}: {
  open: any;
  setOpen: any;
  fetchCustomers: () => void;
}) {
  const [name, setName] = useState("");
  const [rfc, setRfc] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  function reset() {
    setName("");
    setRfc("");
    setPhone("");
    setEmail("");
    setAddress("");
  }

  //función que se ejecuta al presionar registrar
  async function register() {
    try {
      setLoading(true);
      if (isEmpty(name.trim()) || isEmpty(rfc.trim()))
        throw new Error("Ingrese un nombre y un RFC.");

      if (!isEmpty(email.trim()) && !validMail(email))
        throw new Error("Ingrese un correo válido.");

      const data = {
        name: name.trim(),
        rfc: rfc.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      };

      const res = await axios.post("/api/customers", data);

      fetchCustomers();
      setLoading(false);
      reset();
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
          <AlertDialogTitle>Registrar Cliente</AlertDialogTitle>
          <AlertDialogDescription className="text-black flex flex-col gap-1 max-h-[300px] overflow-y-scroll items-start">
            <label>Nombre</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>RFC</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="RFC"
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
            />
            <label>Teléfono</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label>Correo electrónico</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Dirección</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={register} disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateCustomer;
