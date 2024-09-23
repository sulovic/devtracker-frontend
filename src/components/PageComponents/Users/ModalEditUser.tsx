import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import type { AuthUser, UserRole } from "../../../types/types";
import { AxiosInstance } from "axios";
import useParams from "../../../hooks/useParams";
import { handleApiError } from "../../../services/errorHandlers";

const ModalEditUser: React.FC<{
  setShowModalEditUser: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUsers: () => void;
  selectedUser: AuthUser;
}> = ({ setShowModalEditUser, fetchUsers, selectedUser }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const [editedUser, setEditedUser] = useState<AuthUser>(selectedUser);
  const { allUserRoles } = useParams();

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e,
  ) => {
    setEditedUser({
      ...editedUser,
      [e.target.id]:
        e.target.id === "roleId" ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleChangeRole: (role: UserRole) => void = (role) => {
    const editedUserData: AuthUser = { ...editedUser };
    if (
      editedUserData.roles?.some(
        (existingRole) => existingRole?.userRole?.roleId === role?.roleId,
      )
    ) {
      editedUserData.roles = editedUserData.roles?.filter(
        (existingRole) => existingRole?.userRole?.roleId !== role?.roleId,
      );
    } else {
      editedUserData.roles?.push({ userRole: role });
    }
    setEditedUser(editedUserData);
  };

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOk = async () => {
    try {
      setShowSpinner(true);
      const responseEditUser = await axiosPrivate.put(
        `/api/users/${editedUser?.userId}`,
        editedUser,
      );
      if (responseEditUser) {
        toast.success(
          `Korisnik ${editedUser.firstName + " " + editedUser.lastName} je uspešno izmenjen!`,
          {
            position: "top-center",
          },
        );
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
      setShowModalEditUser(false);
      fetchUsers();
    }
  };

  return (
    <div className="z-5 relative">
      <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form
          className="flex min-h-full items-center justify-center p-4 text-center"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
          <div className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-zinc-800">
            <div className="w-full py-4 sm:mt-0">
              {/* Modal Head */}
              <div className="text-left">
                <h4>Dodavanje novog korisnika</h4>
                <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
                {/* Modal Body */}
                <div className="my-2">
                  <h5>Podaci o korisniku:</h5>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName">Ime</label>
                    <input
                      type="text"
                      id="firstName"
                      aria-describedby="Ime"
                      value={editedUser?.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e)
                      }
                      maxLength={64}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Prezime</label>
                    <input
                      type="text"
                      id="lastName"
                      aria-describedby="Prezime"
                      value={editedUser?.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e)
                      }
                      maxLength={64}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      aria-describedby="Email"
                      value={editedUser?.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e)
                      }
                      maxLength={64}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="roleId">Ovlašćenja korisnika</label>
                    <div className="flex flex-wrap gap-4">
                      {allUserRoles.length &&
                        allUserRoles.map((role: UserRole) => (
                          <div
                            className="flex flex-col items-center justify-center"
                            key={role?.roleId}
                          >
                            <input
                              type="checkbox"
                              id={`role-${role?.roleId}`}
                              name="roleId"
                              value={role?.roleId}
                              checked={
                                editedUser?.roles
                                  ? editedUser?.roles.some(
                                      (asignedRole) =>
                                        asignedRole?.userRole?.roleId ===
                                        role?.roleId,
                                    )
                                  : false
                              }
                              onChange={() => handleChangeRole(role)}
                            />
                            <label htmlFor={`role-${role?.roleId}`}>
                              {role?.roleName}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

            {/* Modal Buttons */}
            <div className="flex flex-row-reverse gap-2">
              <button type="submit" className="button button-sky">
                OK
              </button>
              <button
                type="button"
                className="button button-zinc"
                onClick={() => setShowModalEditUser(false)}
              >
                Odustani
              </button>
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <Modal
          onOK={() => handleSubmitOk()}
          onCancel={() => setShowModal(false)}
          title="Potvrda dodavanje novog korisnika"
          question={`Da li ste sigurni da zelite da izmenite postojećeg korisnika ${editedUser?.firstName + " " + editedUser?.lastName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default ModalEditUser;
