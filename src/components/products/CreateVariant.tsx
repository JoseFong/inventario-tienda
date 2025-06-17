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
import { Product, Provider } from "@/generated/prisma";

function CreateVariant({
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
  const [sku, setSku] = useState("");
  const [variantName, setVariantName] = useState("");

  const [file, setFile] = useState<File>();
  const [pictureUrl, setPictureUrl] = useState("");

  const [price, setPrice] = useState<any>();
  const [stock, setStock] = useState<any>();

  const [imgOption, setImgOption] = useState("link");
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
        setPictureUrl(response.data);
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

  //Función que detecta cuando se cambia el archivo de la foto
  function handleChange(e: any) {
    setFile(e.target?.files?.[0]);
  }

  useEffect(() => {
    setPictureUrl("");
    setUploadedImage(false);
  }, [imgOption]);

  function reset() {
    setSku("");
    setPrice(0);
    setStock(0);
    setPictureUrl("");
    setImgOption("file");
    setUploadedImage(false);
    setVariantName("");
  }

  async function register() {
    try {
      setLoading(true);

      if (
        isEmpty(sku) ||
        isEmpty(variantName) ||
        isEmpty(price) ||
        isEmpty(stock) ||
        isEmpty(variantName)
      ) {
        throw new Error("Complete todos los campos.");
      }

      if (price <= 0) throw new Error("Ingrese un precio mayor a $0");

      if (stock < 0) throw new Error("Ingrese un valor de Stock 0 o más.");

      const data = {
        productId: product.id,
        sku: sku.trim(),
        variantName: variantName.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        pictureUrl: pictureUrl.trim(),
      };

      const res = await axios.post("/api/variants", data);

      reset();
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
          <AlertDialogTitle>
            Registrar Variante de {product.name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black flex flex-col gap-1 max-h-[400px] overflow-y-scroll">
            <label>Nombre</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="Nombre"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
            />
            <label>SKU</label>
            <input
              className="bg-zinc-100 p-1 rounded-md w-full"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
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
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
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
          <Button disabled={loading} onClick={register}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateVariant;
