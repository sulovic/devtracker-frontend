import React, { useState } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import type { Product } from "../../../types/types";
import { AxiosInstance } from "axios";
import { handleApiError } from "../../../services/errorHandlers";

const ModalNewProduct: React.FC<{ setShowModalNewProduct: React.Dispatch<React.SetStateAction<boolean>>; fetchProducts: () => void }> = ({
  setShowModalNewProduct,
  fetchProducts,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const [newProduct, setNewProduct] = useState<Product>({
    productName: "",
  });

  const handleChange : (e: React.ChangeEvent<HTMLInputElement>) => void  = (e) => {
    setNewProduct({ ...newProduct, [e.target.id]: e.target.id === "regularPrice" ? parseFloat(e.target.value) : e.target.value });
  };

  const handleSubmit : (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOk : () => void = async () => {
    try {
      setShowSpinner(true);
      let productData: Product = { ...newProduct };
      const responseAddedProduct: { data: Product } = await axiosPrivate.post("/api/products", productData);
      if (responseAddedProduct) {
        toast.success(`Proizvod ${responseAddedProduct?.data?.productName} je uspešno dodat!`, {
          position: "top-center",
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
      setNewProduct({ productName: "" });
      setShowModalNewProduct(false);
      fetchProducts();
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
                <h4>Dodavanje novog proizvoda</h4>
                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
                {/* Modal Body */}
                <div className="my-2">
                  <h5>Podaci o proizvodu:</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div>
                    <label htmlFor="productName">Naziv proizvoda</label>
                    <input
                      type="text"
                      id="productName"
                      aria-describedby="Naziv proizvoda"
                      value={newProduct?.productName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>  handleChange(e)}
                      maxLength={64}
                      required
                    />
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
              <button type="button" className="button button-gray" onClick={() => setShowModalNewProduct(false)}>
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
          title="Potvrda dodavanje novog proizvoda"
          question={`Da li ste sigurni da zelite da dodate nov proizvod ${newProduct?.productName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default ModalNewProduct;
