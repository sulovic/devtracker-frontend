import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import { AxiosInstance } from "axios";
import type {  Priority, Type, User, UserRole } from "../../../types/types";
import { handleApiError } from "../../../services/errorHandlers";

const ModalNewUser: React.FC<{ setShowModalNewIssue: React.Dispatch<React.SetStateAction<boolean>>; fetchIssues: () => void }> = ({
  setShowModalNewIssue,
  fetchIssues,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [allPriorities, setAllPriorities ] = useState<Priority[]>([]);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const [newUser, setNewUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });

  const fatchAllStatusesPriorities: () => void = async () => {
    try {
      setShowSpinner(true);
      const priority: { data: Priority[] } = await axiosPrivate.get("/api/priority");
      setAllPriorities(priority?.data);
      console.log(priority?.data);
      const types: { data: Type[] } = await axiosPrivate.get("/api/types");
      setAllTypes(types?.data);
      console.log(types?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fatchAllStatusesPriorities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setNewUser({ ...newUser, [e.target.id]: e.target.id === "roleId" ? parseInt(e.target.value) : e.target.value });
  };

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleChangeRole: (role: UserRole) => void = (role) => {
    // const editedUser: User = { ...newUser };
    // if (editedUser.roles?.some((existingRole) => existingRole?.userRoles?.roleId === role?.roleId)) {
    //   editedUser.roles = editedUser.roles?.filter((existingRole) => existingRole?.userRoles?.roleId !== role?.roleId);
    // } else {
    //   editedUser.roles?.push({userRoles: role});
    // }
    // setNewUser(editedUser);
  };

  const handleSubmitOk: () => void = async () => {
    try {
      setShowSpinner(true);
      const responseAddUser: { data: User } = await axiosPrivate.post("/api/users", newUser);
      if (responseAddUser) {
        toast.success(`Korisnik ${responseAddUser?.data?.firstName + " " + responseAddUser?.data?.lastName} je uspešno dodat!`, {
          position: "top-center",
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
      setShowModalNewIssue(false);
      fetchIssues();
    }
  };

  return (
    <div className="relative z-5">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form className="flex min-h-full items-center justify-center p-4 text-center" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <div className="relative p-4 transform w-full max-w-3xl overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:p-8">
            <div className="w-full sm:mt-0 py-4">
              {/* Modal Head */}
              <div className="text-left">
                <h4>Kreiranje novog zahteva</h4>
                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
                {/* Modal Body */}
                <div className="my-2">
                  <h5>Podaci o zahtevu:</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="firstName">Ime</label>
                    <input
                      type="text"
                      id="firstName"
                      aria-describedby="Ime"
                      value={newUser?.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                      maxLength={64}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="roleId">Ovlašćenja korisnika</label>
                    <div className=" flex gap-4 flex-wrap">
                      {/* {allUserRoles.length &&
                        allUserRoles.map((role: UserRole) => (
                          <div className="flex flex-col items-center justify-center" key={role?.roleId}>
                            <input
                              type="checkbox"
                              id={`role-${role?.roleId}`}
                              name="roleId"
                              value={role?.roleId}
                              checked={newUser?.roles ? newUser?.roles.some((asignedRole) => asignedRole?.userRoles?.roleId === role?.roleId) : false}
                              onChange={() => handleChangeRole(role)}
                            />
                            <label htmlFor={`role-${role?.roleId}`}>{role?.roleName}</label>
                          </div>
                        ))} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 w-full h-0.5 bg-zinc-400"></div>

            {/* Modal Buttons */}
            <div className="gap-2 flex flex-row-reverse">
              <button type="submit" className="button button-sky">
                OK
              </button>
              <button type="button" className="button button-gray" onClick={() => setShowModalNewIssue(false)}>
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
