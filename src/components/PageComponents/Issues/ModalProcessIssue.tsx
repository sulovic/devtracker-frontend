import React, { useState, useEffect } from "react";
import Spinner from "../../Spinner";
import Modal from "../../Modal";
import { Issue, Type, Priority, Product, Status, UserRole } from "../../../types/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { AxiosInstance } from "axios";
import { handleApiError } from "../../../services/errorHandlers";
import { toast } from "react-toastify";
import { nextStatus, nextRespRole } from "../../../services/processMatrix";

const ModalProcessIssue: React.FC<{
  issue: Issue;
  setShowModalProcessIssue: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIssue: () => void;
}> = ({ issue, fetchIssue, setShowModalProcessIssue }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allPriorities, setAllPriorities] = useState<Priority[]>([]);
  const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [nextStatuses, setNextStatuses] = useState<Status[]>([]);
  const [nextRespRoles, setNextRespRoles] = useState<UserRole[]>([]);
  const [editedIssue, setEditedIssue] = useState<Issue>(issue);

  const fetchAllProductsPrioritiesTypes: () => void = async () => {
    try {
      setShowSpinner(true);
      const products: { data: Product[] } = await axiosPrivate.get("/api/products");
      setAllProducts(products?.data);
      const priority: { data: Priority[] } = await axiosPrivate.get("/api/priority");
      setAllPriorities(priority?.data);
      const types: { data: Type[] } = await axiosPrivate.get("/api/types");
      setAllTypes(types?.data);
      setNextStatuses(nextStatus(issue?.status?.statusId));
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchAllProductsPrioritiesTypes();
  }, []);

  useEffect(() => {}, [nextRespRoles]);

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOK: () => void = async () => {
    try {
      setShowSpinner(true);
      const responseEditIssue: { data: Issue } = await axiosPrivate.put(`/api/issues/${issue?.issueId}`, editedIssue);
      if (responseEditIssue) {
        toast.success(`Zahtev ${responseEditIssue?.data?.issueName} je uspešno izmenjen!`, {
          position: "top-center",
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
      setShowModalProcessIssue(false);
      fetchIssue();
    }
  };

  return (
    <>
      <div className="relative z-5">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <form className="flex min-h-full items-center justify-center p-4 text-center" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <div className="relative p-4 transform w-full max-w-3xl overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl sm:p-8">
              <div className="w-full sm:mt-0 py-4">
                {/* Modal Head */}
                <div className="text-left">
                  <h4>Obrada postojećeg zahteva</h4>
                  <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
                  {/* Modal Body */}
                  <div className="my-2">
                    <h5>Podaci o zahtevu:</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="product">Proizvod</label>
                      <select
                        id="product"
                        aria-label="Select product"
                        required
                        value={editedIssue?.product?.productId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditedIssue({
                            ...editedIssue,
                            [e.target.id]: allProducts.find((product: Product) => product?.productId === parseInt(e.target.value)),
                          })
                        }
                      >
                        <option key={`product-"none"`} value="">
                          Odaberite proizvod
                        </option>
                        {allProducts.length &&
                          allProducts.map((product: Product) => (
                            <option key={`product-${product?.productId}`} value={product?.productId}>
                              {product?.productName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="type">Tip zahteva</label>
                      <select
                        id="type"
                        aria-label="Select Issue type"
                        required
                        value={editedIssue?.type?.typeId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditedIssue({ ...editedIssue, [e.target.id]: allTypes.find((type: Type) => type.typeId === parseInt(e.target.value)) })
                        }
                      >
                        <option key={`type-"none"`} value="">
                          Odaberite tip zahteva
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
                        value={editedIssue?.priority?.priorityId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditedIssue({
                            ...editedIssue,
                            [e.target.id]: allPriorities.find((priority: Priority) => priority?.priorityId === parseInt(e.target.value)),
                          })
                        }
                      >
                        <option key={`priority-"none"`} value="">
                          Odaberite prioritet
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

                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
                <div className="my-2">
                  <h5>Novi status i odgovornost:</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="status">Sledeći status:</label>
                    <select
                      id="status"
                      aria-label="Select status"
                      required
                      value={editedIssue?.status?.statusId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setEditedIssue({
                          ...editedIssue,
                          [e.target.id]: nextStatuses.find((status: Status) => status?.statusId === parseInt(e.target.value)),
                        });
                        setNextRespRoles(nextRespRole(parseInt(e.target.value)));
                      }}
                    >
                      <option key={`status-"none"`} value="">
                        Odaberite novi status
                      </option>
                      {nextStatuses.length &&
                        nextStatuses.map((status: Status) => (
                          <option key={`status-${status?.statusId}`} value={status?.statusId}>
                            {status?.statusName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="type">Odgovorna grupa</label>
                    <select
                      id="respRole"
                      aria-label="Select responsible group"
                      required
                      value={editedIssue?.respRole?.roleId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEditedIssue({ ...editedIssue, [e.target.id]: nextRespRoles.find((role: UserRole) => role.roleId === parseInt(e.target.value)) })
                      }
                    >
                      <option key={`role-"none"`} value="">
                        Odaberite odgovornu grupu
                      </option>
                      {nextRespRoles.length &&
                        nextRespRoles.map((role: UserRole) => (
                          <option key={`type-${role?.roleId}`} value={role.roleId}>
                            {role?.roleName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>

                {/* Modal Buttons */}
                <div className="gap-2 flex flex-row-reverse">
                  <button type="submit" className="button button-sky">
                    OK
                  </button>
                  <button type="button" className="button button-gray" onClick={() => setShowModalProcessIssue(false)}>
                    Odustani
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <Modal
          onOK={() => handleSubmitOK()}
          onCancel={() => setShowModal(false)}
          title="Potvrda obrade zahteva"
          question={`Da li ste sigurni da želite da obradite zahtev: ${editedIssue?.issueName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default ModalProcessIssue;
