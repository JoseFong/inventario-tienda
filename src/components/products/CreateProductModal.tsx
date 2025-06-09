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

function CreateProductModal({
  open,
  setOpen,
  fetchProducts,
}: {
  open: any;
  setOpen: any;
  fetchProducts: () => void;
}) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<any>();
  const [stock, setStock] = useState<any>();
  const [hasVariants, setHasVariants] = useState(false);

  const [file, setFile] = useState<File>();
  const [imgOption, setImgOption] = useState("link");
  const [imgLink, setImgLink] = useState("");
  const [uploadedImage, setUploadedImage] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingUploadedImage, setLoadingUploadedImage] = useState(false);

  async function upload() {
    try {
      setLoadingUploadedImage(true);
      if (!file) throw new Error("Seleccione un archivo.");

      const data = new FormData();
      data.set("file", file);

      const response = await axios.post("/api/files", data);

      if (response) {
        setImgLink(response.data);
        setUploadedImage(true);
      }
      setLoadingUploadedImage(false);
    } catch (e: any) {
      setLoadingUploadedImage(false);
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

  async function register() {
    try {
      setLoading(true);

      if (isEmpty(sku) || isEmpty(name) || isEmpty(price) || isEmpty(stock)) {
        throw new Error("Complete todos los campos.");
      }

      if (price <= 0) throw new Error("Ingrese un precio mayor a $0");

      if (stock < 0) throw new Error("Ingrese un valor de Stock 0 o más.");

      const data = {
        sku: sku.trim(),
        name: name.trim(),
        price: parseFloat(price),
        hasVariants: hasVariants,
        stock: parseInt(stock),
        pictureUrl: imgLink.trim(),
      };

      const res = await axios.post("/api/productos", data);

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

  useEffect(() => {
    setImgLink("");
    setUploadedImage(false);
  }, [imgOption]);

  useEffect(() => {
    setSku("");
    setName("");
    setPrice(0);
    setStock(0);
    setHasVariants(false);
    setImgLink("");
    setImgOption("file");
    setUploadedImage(false);
  }, [open, setOpen]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar Producto</AlertDialogTitle>
          <AlertDialogDescription className="text-black flex flex-col gap-1 max-h-[400px] overflow-y-scroll items-start">
            <label>SKU</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <label>Nombre</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Precio</label>
            <input
              type="number"
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="$"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label>Stock</label>
            <input
              type="number"
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <div className="flex flex-row gap-2">
              <label>¿El producto tiene variantes?</label>
              <input
                checked={hasVariants}
                onChange={() => setHasVariants(!hasVariants)}
                type="checkbox"
              />
            </div>
            <div className="flex flex-row gap-1 items-center my-2">
              <label>Seleccionar imagen de: </label>
              <select
                className="bg-zinc-100 p-1 rounded-md"
                value={imgOption}
                onChange={(e) => setImgOption(e.target.value)}
              >
                <option value="link">Link</option>
                <option value="file">Archivo</option>
              </select>
            </div>
            {imgOption === "link" ? (
              <input
                className="bg-zinc-100 p-1 rounded-md w-full"
                placeholder="Copie link aqui"
                value={imgLink}
                onChange={(e) => setImgLink(e.target.value)}
              />
            ) : (
              <>
                <input type="file" onChange={handleChange} />
                <div className="flex flex-row gap-1 items-center">
                  {uploadedImage ? (
                    <>
                      <Button className="bg-green-500" disabled>
                        ¡Foto Subida!
                      </Button>
                    </>
                  ) : (
                    <>
                      {loadingUploadedImage ? (
                        <>
                          <Button disabled>Subiendo...</Button>
                          <label className="text-red-500">
                            ¡Recuerda subir la foto!
                          </label>
                        </>
                      ) : (
                        <>
                          <Button onClick={upload}>Subir</Button>
                          <label className="text-red-500">
                            ¡Recuerda subir la foto!
                          </label>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {loading ? (
            <Button disabled>Cargando...</Button>
          ) : (
            <Button onClick={register}>Registrar</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateProductModal;
