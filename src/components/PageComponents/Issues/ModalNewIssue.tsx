import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import { AxiosInstance } from "axios";
import type {
  Priority,
  Type,
  Issue,
  AuthContextType,
} from "../../../types/types";
import { handleApiError } from "../../../services/errorHandlers";
import useAuth from "../../../hooks/useAuth";
import useParams from "../../../hooks/useParams";
import { Navigate } from "react-router-dom";

const ModalNewIssue: React.FC<{
  setShowModalNewIssue: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIssues: () => void;
}> = ({ setShowModalNewIssue, fetchIssues }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const { allPriorities, allTypes } = useParams();

  if (!authUser) {
    return <Navigate to="/" />;
  }

  const [newIssue, setNewIssue] = useState<Issue>({
    issueName: "",
    issueDesc: "",
    createdAt: new Date(),
    user: authUser
      ? authUser
      : { firstName: "", lastName: "", email: "", iat: 0, exp: 0, roles: [] },
    type: { typeName: "" },
    status: { statusId: 1, statusName: "New" },
    priority: { priorityName: "" },
    respRole: { roleId: 2001, roleName: "Triager" },
    statusHistory: [],
    comments: [],
  });

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOK: () => void = async () => {
    try {
      setShowSpinner(true);
      const responseAddIssue: { data: Issue } = await axiosPrivate.post(
        "/api/issues",
        newIssue,
      );
      if (responseAddIssue) {
        toast.success(
          `Novi zahtev ${responseAddIssue?.data?.issueName} je uspešno kreiran!`,
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
      setShowModalNewIssue(false);
      fetchIssues();
    }
  };

  return (
    <>
      <div className="relative z-20">
        <div className="fixed inset-0 bg-zinc-500 bg-opacity-75">
          <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
            <form
              className="flex min-h-full items-center justify-center p-4 text-center"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                handleSubmit(e)
              }
            >
              <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl sm:p-8 dark:bg-zinc-800">
                <div className="w-full py-4 sm:mt-0">
                  {/* Modal Head */}
                  <div className="text-left">
                    <h4>Kreiranje novog zahteva</h4>
                    <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
                    {/* Modal Body */}
                    <div className="my-2">
                      <h5>Podaci o zahtevu:</h5>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div>
                        <label htmlFor="issueName">Naziv zahteva</label>
                        <input
                          type="text"
                          id="issueName"
                          aria-describedby="Issue Name"
                          value={newIssue?.issueName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewIssue({
                              ...newIssue,
                              [e.target.id]: e.target.value,
                            })
                          }
                          maxLength={64}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="issueDesc">Opis zahteva</label>
                        <textarea
                          id="issueDesc"
                          aria-describedby="Issue Description"
                          value={newIssue?.issueDesc}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) =>
                            setNewIssue({
                              ...newIssue,
                              [e.target.id]: e.target.value,
                            })
                          }
                          maxLength={512}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="type">Tip zahteva</label>
                        <select
                          id="type"
                          aria-label="Select Issue type"
                          required
                          value={newIssue?.type?.typeId}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setNewIssue({
                              ...newIssue,
                              [e.target.id]: allTypes.find(
                                (type: Type) =>
                                  type.typeId === parseInt(e.target.value),
                              ),
                            })
                          }
                        >
                          <option key={`type-"none"`} value="">
                            Odaberite tip zahteva sa liste
                          </option>
                          {allTypes.length &&
                            allTypes.map((type: Type) => (
                              <option
                                key={`type-${type?.typeId}`}
                                value={type.typeId}
                              >
                                {type?.typeName}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="priority">Prioritet</label>
                        <select
                          id="priority"
                          aria-label="Select priority"
                          required
                          value={newIssue?.priority?.priorityId}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setNewIssue({
                              ...newIssue,
                              [e.target.id]: allPriorities.find(
                                (priority: Priority) =>
                                  priority?.priorityId ===
                                  parseInt(e.target.value),
                              ),
                            })
                          }
                        >
                          <option key={`priority-"none"`} value="">
                            Odaberite prioritet sa liste
                          </option>
                          {allPriorities.length &&
                            allPriorities.map((priority: Priority) => (
                              <option
                                key={`priority-${priority?.priorityId}`}
                                value={priority?.priorityId}
                              >
                                {priority?.priorityName}
                              </option>
                            ))}
                        </select>
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
                    onClick={() => setShowModalNewIssue(false)}
                  >
                    Odustani
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          onOK={() => handleSubmitOK()}
          onCancel={() => setShowModal(false)}
          title="Potvrda dodavanje novog zahteva"
          question={`Da li ste sigurni da želite da kreirate nov zahtev: ${newIssue?.issueName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default ModalNewIssue;
