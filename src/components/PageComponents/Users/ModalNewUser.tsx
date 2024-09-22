import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import { AxiosInstance } from "axios";
import type { AuthUser, UserRole } from "../../../types/types";
import { handleApiError } from "../../../services/errorHandlers";
import useParams from "../../../hooks/useParams";

const ModalNewUser: React.FC<{
  setShowModalNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUsers: () => void;
}> = ({ setShowModalNewUser, fetchUsers }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { allUserRoles } = useParams();
  const [newUser, setNewUser] = useState<AuthUser>({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.id]:
        e.target.id === "roleId" ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleChangeRole: (role: UserRole) => void = (role) => {
    const editedUser: AuthUser = { ...newUser };
    if (
      editedUser.roles?.some(
        (existingRole) => existingRole?.userRole?.roleId === role?.roleId,
      )
    ) {
      editedUser.roles = editedUser.roles?.filter(
        (existingRole) => existingRole?.userRole?.roleId !== role?.roleId,
      );
    } else {
      editedUser.roles?.push({ userRole: role });
    }
    setNewUser(editedUser);
  };

  const handleSubmitOk: () => void = async () => {
    try {
      setShowSpinner(true);
      const responseAddUser: { data: AuthUser } = await axiosPrivate.post(
        "/api/users",
        newUser,
      );
      if (responseAddUser) {
        toast.success(
          `Korisnik ${responseAddUser?.data?.firstName + " " + responseAddUser?.data?.lastName} je uspešno dodat!`,
          {
            position: "top-center",
          },
        );
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
      setShowModalNewUser(false);
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
                      value={newUser?.firstName}
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
                      value={newUser?.lastName}
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
                      value={newUser?.email}
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
                                newUser?.roles
                                  ? newUser?.roles.some(
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
                onClick={() => setShowModalNewUser(false)}
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
          question={`Da li ste sigurni da zelite da dodate novog korisnika ${newUser?.firstName + " " + newUser?.lastName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default ModalNewUser;
