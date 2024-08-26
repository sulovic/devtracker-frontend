import React, { useState, useEffect } from "react";
import Spinner from "../../Spinner";
import Modal from "../../Modal";
import { Issue, Type, Priority, Product } from "../../../types/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { AxiosInstance } from "axios";
import { handleApiError } from "../../../services/errorHandlers";
import { toast } from "react-toastify";

const ModalEditProductTypePriority: React.FC<{
  issue: Issue;
  setShowModalEditProductTypePriority: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIssue: () => void;
}> = ({ issue, fetchIssue, setShowModalEditProductTypePriority }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allPriorities, setAllPriorities] = useState<Priority[]>([]);
  const [allTypes, setAllTypes] = useState<Type[]>([]);
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
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchAllProductsPrioritiesTypes();
  }, []);

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOK: () => void = async () => {
    try {
      setShowSpinner(true);
      const responseAddIssue: { data: Issue } = await axiosPrivate.put(`/api/issues/${issue?.issueId}`, editedIssue);
      if (responseAddIssue) {
        toast.success(`Zahtev ${responseAddIssue?.data?.issueName} je uspešno izmenjen!`, {
          position: "top-center",
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
      setShowModalEditProductTypePriority(false);
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
                  <h4>Izmena postojećeg zahteva</h4>
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
                          Odaberite proizvod sa liste
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
                        value={editedIssue?.priority?.priorityId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditedIssue({
                            ...editedIssue,
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

                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>

                {/* Modal Buttons */}
                <div className="gap-2 flex flex-row-reverse">
                  <button type="submit" className="button button-sky">
                    OK
                  </button>
                  <button type="button" className="button button-gray" onClick={() => setShowModalEditProductTypePriority(false)}>
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
          title="Potvrda izmene zahteva"
          question={`Da li ste sigurni da želite da izmenite zahtev: ${editedIssue?.issueName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default ModalEditProductTypePriority;
