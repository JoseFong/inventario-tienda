"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function HomePage() {
  const [file, setFile] = useState<File>();
  const [src, setSrc] = useState("");

  async function upload() {
    try {
      if (!file) throw new Error("Seleccione un archivo.");

      const data = new FormData();
      data.set("file", file);

      const response = await axios.post("/api/files", data);

      if (response) {
        setSrc(response.data);
      }
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  function handleChange(e: any) {
    setFile(e.target?.files?.[0]);
  }

  return (
    <div className="p-5">
      <input type="file" onChange={handleChange} />
      <Button onClick={upload}>Agregar imagen</Button>
    </div>
  );
}

export default HomePage;
