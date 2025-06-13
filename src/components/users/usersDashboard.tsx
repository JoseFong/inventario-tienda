"use client";
import { User } from "@/generated/prisma";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import RegisterUser from "./registerUser";
import UpdateUser from "./updateUser";
import { Skeleton } from "../ui/skeleton";
import DeleteUser from "./deleteUser";
import AskForPasswordModal from "../general/askForPassword";

function UsersDashboard({ session }: { session: any }) {
  const [users, setUsers] = useState<User[]>([]);

  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User>();

  const [loading, setLoading] = useState(false);

  const [tokenModal, setTokenModal] = useState(false);
  const [askForPasswordModal, setAskForPasswordModal] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [result, setResults] = useState<User[]>([]);

  function toggleTokenModal() {
    setTokenModal(!tokenModal);
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axios.get("/api/usuarios");
      setUsers(res.data);
      setResults(res.data);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setResults(users);
    } else {
      const aux: User[] = users.filter((u: User) =>
        u.username.toLowerCase().includes(searchValue.trim().toLowerCase())
      );
      setResults(aux);
    }
  }, [searchValue]);

  return (
    <div className="p-5  flex flex-col gap-2 w-full">
      <div className="absolute z-0">
        <RegisterUser
          open={addUserModalOpen}
          setOpen={setAddUserModalOpen}
          fetchUsers={fetchUsers}
        />
        <AskForPasswordModal
          open={askForPasswordModal}
          setOpen={setAskForPasswordModal}
          openSecond={toggleTokenModal}
        />
        {selectedUser && (
          <>
            <UpdateUser
              open={editUserModalOpen}
              setOpen={setEditUserModalOpen}
              fetchUsers={fetchUsers}
              user={selectedUser}
            />
            <DeleteUser
              open={deleteUserModalOpen}
              setOpen={setDeleteUserModalOpen}
              fetchUsers={fetchUsers}
              user={selectedUser}
            />
          </>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <Button
          disabled={loading}
          className="w-auto p-3"
          onClick={() => setAddUserModalOpen(true)}
        >
          Registrar Usuario
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <label>Buscar</label>
        <input
          className="bg-zinc-100 p-1 rounded-md"
          placeholder="Buscar usuario"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      {loading ? (
        <>
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-7" />
          <Skeleton className="w-full h-7" />
          <Skeleton className="w-full h-7" />
        </>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-start border-black border-2 p-1">
                  Nombre de usuario
                </th>
                <th className="text-start border-black border-2 p-1">Tipo</th>
                <th className="text-start border-black border-2 p-1">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {result.map((u: User) => (
                <tr>
                  <td className="p-1 border-2 border-black">{u.username}</td>
                  <td className="p-1 border-2 border-black">{u.type}</td>
                  <td className="p-1 border-2 border-black">
                    <Button
                      onClick={() => {
                        setSelectedUser(u);
                        setEditUserModalOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    {u.id !== session.id && (
                      <Button
                        className="ml-1"
                        variant={"destructive"}
                        onClick={() => {
                          setSelectedUser(u);
                          setDeleteUserModalOpen(true);
                        }}
                      >
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.length === 0 && (
            <div className="w-full text-center">
              No se encontraron usuarios.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UsersDashboard;
