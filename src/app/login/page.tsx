"use client";
import { Button } from "@/components/ui/button";
import { isEmpty } from "@/utils/validatons";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [seePassword, setSeePassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function login() {
    setLoading(true);
    try {
      if (isEmpty(username) || isEmpty(password))
        throw new Error("Complete todos los campos.");

      const data = {
        username: username.trim(),
        password: password.trim(),
      };

      const res = await axios.post("/api/login", data);
      router.push("/ventas");
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
    <div className="flex items-center flex-col gap-1 justify-center h-screen w-screen">
      <h1 className="font-bold text-xl">Iniciar sesión</h1>
      <div className="flex flex-col gap-1 items-start">
        <label>Nombre de usuario</label>
        <input
          className="bg-zinc-100 p-1 rounded-md"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Contraseña</label>
        {seePassword ? (
          <input
            className="bg-zinc-100 p-1 rounded-md"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          <input
            type="password"
            className="bg-zinc-100 p-1 rounded-md"
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
      </div>

      {loading ? (
        <Button disabled className="mt-2">
          Cargando...
        </Button>
      ) : (
        <Button className="mt-2" onClick={login}>
          Iniciar sesión
        </Button>
      )}
      <p className="mt-3 text-sm">
        Para probar la App use Usuario: <span className="font-bold">Admin</span>
        , Contraseña: <span className="font-bold">Admin1234</span>
      </p>
    </div>
  );
}

export default Login;
