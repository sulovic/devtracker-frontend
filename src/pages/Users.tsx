import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../Context/AuthContext";
import ModalNewUser from "../components/PageComponents/Users/ModalNewUser";
import ModalEditUser from "../components/PageComponents/Users/ModalEditUser";
import { toast } from "react-toastify";
import { User, AuthContextType, UserRole } from "../types/types";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";

const Users: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModalNewUser, setShowModalNewUser] = useState<boolean>(false);
  const [showModalEditUser, setShowModalEditUser] = useState<boolean>(false);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const tableHeaders: string[] = ["Ime i prezime", "Email", "Nivo ovašćenja", "Izmeni", "Obriši"];

  const fetchUsers: () => void = async () => {
    setShowSpinner(true);
    try {
      const response: { data: User[] } = await axiosPrivate.get("/api/users");
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

  const handleEditUser: (user: User) => void = (user) => {
    setSelectedUser(user);
    setShowModalEditUser(true);
  };

  const handleDeleteUser: (user: User) => void = (user) => {
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
        <h3 className="mt-4">Korisnici aplikacije</h3>
        <div>
          <div className="flex justify-end px-3">
            <button type="button" className="button button-sky " aria-label="New User" onClick={() => setShowModalNewUser(true)}>
              Dodaj korisnika
            </button>
          </div>

          {/* Render main data DIV */}

          <div>
            <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
              <div className="table-responsive p-3">
                <table className="w-full text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                  <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    <tr>
                      {tableHeaders.map((tableKey, index) => (
                        <th className="px-6 py-3" key={index}>
                          {tableKey}
                        </th>
                      ))}
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
                                {user?.roles && user?.roles.map((role) => (
                                  <div key={role?.userRoles?.roleId}>{role?.userRoles?.roleName}</div>
                                ))}
                              </div>
                            </td>
                            <td key={`editUser_${index}`} className="text-center">
                              <button
                                type="button"
                                className="button button-sky"
                                aria-label="EditUser"
                                disabled={authUser?.email === user?.email || !authUser?.roles.some((role) => role?.roleId > 5000)}
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
                                disabled={authUser?.email === user?.email || !authUser?.roles.some((role) => role?.roleId > 5000)}
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
                {/* Modal and Spinner component */}
              </div>
            </div>
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
