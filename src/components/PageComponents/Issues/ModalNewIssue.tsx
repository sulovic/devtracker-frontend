import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import { AxiosInstance } from "axios";
import type { Priority, Type, Issue, Product, AuthContextType } from "../../../types/types";
import { handleApiError } from "../../../services/errorHandlers";
import { useAuth } from "../../../Context/AuthContext";
import { Navigate } from "react-router-dom";

const ModalNewIssue: React.FC<{ setShowModalNewIssue: React.Dispatch<React.SetStateAction<boolean>>; fetchIssues: () => void }> = ({
  setShowModalNewIssue,
  fetchIssues,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [allPriorities, setAllPriorities] = useState<Priority[]>([]);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();

  if (!authUser) {
    return <Navigate to="/" />;
  }

  const [newIssue, setNewIssue] = useState<Issue>({
    issueName: "",
    issueDesc: "",
    createdAt: new Date(),
    user: authUser ? authUser : { firstName: "", lastName: "", email: "", iat: 0, exp: 0, roles: [] },
    type: { typeName: "" },
    status: { statusId: 1, statusName: "New" },
    priority: { priorityName: "" },
    statusHistory: [],
    comments: [],
  });

  console.log(newIssue);

  const fetchAllPrioritiesTypes: () => void = async () => {
    try {
      setShowSpinner(true);
      const priority: { data: Priority[] } = await axiosPrivate.get("/api/priority");
      setAllPriorities(priority?.data);
      const types: { data: Type[] } = await axiosPrivate.get("/api/types");
      setAllTypes(types?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchAllPrioritiesTypes();
  }, []);

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOK: () => void = async () => {
    try {
      setShowSpinner(true);
      const responseAddIssue: { data: Issue } = await axiosPrivate.post("/api/issues", newIssue);
      if (responseAddIssue) {
        toast.success(`Novi zahtev ${responseAddIssue?.data?.issueName} je uspešno kreiran!`, {
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
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form className="flex min-h-full items-center justify-center p-4 text-center" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <div className="relative p-4 transform w-full max-w-3xl overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl sm:p-8">
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
                    <label htmlFor="issueName">Naziv zahteva</label>
                    <input
                      type="text"
                      id="issueName"
                      aria-describedby="Issue Name"
                      value={newIssue?.issueName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewIssue({ ...newIssue, [e.target.id]: e.target.value })}
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
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewIssue({ ...newIssue, [e.target.id]: e.target.value })}
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
                        setNewIssue({ ...newIssue, [e.target.id]: allTypes.find((type: Type) => type.typeId === parseInt(e.target.value)) })
                      }
                    >
                      <option key={`type-"none"`} value="">
                        Odaberite tip zahteva sa liste
                      </option>
                      {allTypes.length &&
                        allTypes.map((type: Type) => (
                          <option key={`type-${type?.typeId}`} value={type.typeId}>
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
                          [e.target.id]: allPriorities.find((priority: Priority) => priority?.priorityId === parseInt(e.target.value)),
                        })
                      }
                    >
                      <option key={`priority-"none"`} value="">
                        Odaberite prioritet sa liste
                      </option>
                      {allPriorities.length &&
                        allPriorities.map((priority: Priority) => (
                          <option key={`priority-${priority?.priorityId}`} value={priority?.priorityId}>
                            {priority?.priorityName}
                          </option>
                        ))}
                    </select>
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
          onOK={() => handleSubmitOK()}
          onCancel={() => setShowModal(false)}
          title="Potvrda dodavanje novog zahteva"
          question={`Da li ste sigurni da želite da kreirate nov zahtev: ${newIssue?.issueName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default ModalNewIssue;
