import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import ModalNewUser from "../components/PageComponents/Users/ModalNewUser";
import ModalEditUser from "../components/PageComponents/Users/ModalEditUser";
import { toast } from "react-toastify";
import { AuthUser, AuthContextType, UserRole } from "../types/types";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";

const Users: React.FC = () => {
  const [usersData, setUsersData] = useState<AuthUser[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [showModalNewUser, setShowModalNewUser] = useState<boolean>(false);
  const [showModalEditUser, setShowModalEditUser] = useState<boolean>(false);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();

  const fetchUsers: () => void = async () => {
    setShowSpinner(true);
    try {
      const response: { data: AuthUser[] } = await axiosPrivate.get("/api/users");
      setUsersData(response?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser: (user: AuthUser) => void = (user) => {
    setSelectedUser(user);
    setShowModalEditUser(true);
  };

  const handleDeleteUser: (user: AuthUser) => void = (user) => {
    setSelectedUser(user);
    setShowModalDeleteUser(true);
  };

  const handleDeleteUserOK: () => void = async () => {
    try {
      setShowSpinner(true);
      await axiosPrivate.delete(`/api/users/${selectedUser?.userId}`);
      toast.success(`Korisnik ${selectedUser?.firstName + " " + selectedUser?.lastName} je uspešno obrisan!`, {
        position: "top-center",
      });
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setSelectedUser(null);
      setShowModalDeleteUser(false);
      fetchUsers();
    }
  };

  const handleDeleteUserCancel: () => void = () => {
    setSelectedUser(null);
    setShowModalDeleteUser(false);
  };

  return (
    <>
      <Navbar Links={DashboardLinks} />
      <div className="mx-2 md:mx-4">
        <div className="flex px-3 mb-2">
          <h3>Korisnici aplikacije</h3>
          <div className="flex flex-grow justify-end items-center">
            <button type="button" className="button button-sky " aria-label="New User" onClick={() => setShowModalNewUser(true)}>
              Dodaj korisnika
            </button>
          </div>
        </div>

        {/* Render main data DIV */}

        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="table-responsive p-3">
            <table className="w-full text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
              <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-4 w-2/12">Ime i prezime</th>
                  <th className="px-4 py-4 w-2/12"> Email</th>
                  <th className="px-4 py-4 w-6/12"> Nivo ovlašćenja</th>
                  <th className="px-4 py-4 "> Izmeni</th>
                  <th className="px-4 py-4 "> Obriši</th>
                </tr>
              </thead>
              <tbody>
                {usersData.length
                  ? usersData.map((user, index) => (
                      <tr key={index} className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        <td key={`ime_prezime_${index}`}>{user?.firstName + " " + user?.lastName}</td>
                        <td key={`email_${index}`}>{user?.email}</td>
                        <td key={`role_${index}`}>
                          <div className="flex gap-2 justify-center align-items-center">
                            {user?.roles &&
                              user?.roles.map((role) => {
                                return <div key={role?.userRole?.roleId}>{role?.userRole?.roleName}</div>;
                              })}
                          </div>
                        </td>
                        <td key={`editUser_${index}`} className="text-center">
                          <button
                            type="button"
                            className="button button-sky"
                            aria-label="EditUser"
                            disabled={authUser?.email === user?.email || !authUser?.roles.some((role) => role?.userRole?.roleId > 5000)}
                            onClick={() => handleEditUser(user)}
                          >
                            Izmeni
                          </button>
                        </td>
                        <td key={`deleteUser_${index}`} className="text-center">
                          <button
                            type="button"
                            className="button button-red"
                            aria-label="Delete"
                            disabled={authUser?.email === user?.email || !authUser?.roles.some((role) => role?.userRole?.roleId > 5000)}
                            onClick={() => handleDeleteUser(user)}
                          >
                            Obriši
                          </button>
                        </td>
                      </tr>
                    ))
                  : !showSpinner && (
                      <tr>
                        <td colSpan={5} className="p-3">
                          Nema podataka o korisnicima...
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModalDeleteUser && (
        <Modal
          onOK={handleDeleteUserOK}
          onCancel={handleDeleteUserCancel}
          title="Potvrda brisanja korisnika"
          question={`Da li ste sigurni da zelite da obrisete korisnika ${selectedUser?.firstName + " " + selectedUser?.lastName}?`}
        />
      )}
      {showModalNewUser && <ModalNewUser setShowModalNewUser={setShowModalNewUser} fetchUsers={fetchUsers} />}
      {selectedUser && showModalEditUser && <ModalEditUser setShowModalEditUser={setShowModalEditUser} fetchUsers={fetchUsers} selectedUser={selectedUser} />}
      {showSpinner && <Spinner />}
    </>
  );
};

export default Users;
