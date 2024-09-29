import React, { useState } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import { AxiosInstance } from "axios";
import type { Product } from "../../../types/types";
import { handleApiError } from "../../../services/errorHandlers";

const ModalEditProduct: React.FC<{
  setShowModalEditProduct: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProducts: () => void;
  selectedProduct: Product;
}> = ({ setShowModalEditProduct, fetchProducts, selectedProduct }) => {
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [showSpinner, setShowSpinner] = useState<Boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const [editedProduct, setEditedProduct] = useState<Product>(selectedProduct);

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e,
  ) => {
    setEditedProduct({ ...editedProduct, [e.target.id]: e.target.value });
  };

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOk = async () => {
    try {
      setShowSpinner(true);
      let productData = { ...editedProduct };
      const responseAddedProduct: { data: Product } = await axiosPrivate.put(
        `/api/products/${productData?.productId}`,
        productData,
      );
      if (responseAddedProduct) {
        toast.success(
          `Proizvod ${responseAddedProduct?.data?.productName} je uspešno izmenjen!`,
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
      setShowModalEditProduct(false);
      fetchProducts();
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
            <div className="w-full sm:mt-0">
              {/* Modal Head */}
              <div className="text-left">
                <h4>Izmena postojećeg proizvoda</h4>
                <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
                {/* Modal Body */}
                <div className="my-2">
                  <h5>Podaci o proizvodu:</h5>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid grid-cols-1">
                    <div>
                      <label htmlFor="productName">Naziv proizvoda</label>
                      <input
                        type="text"
                        id="productName"
                        aria-describedby="Naziv proizvoda"
                        value={editedProduct?.productName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e)
                        }
                        maxLength={64}
                        required
                      />
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
                onClick={() => setShowModalEditProduct(false)}
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
          title="Potvrda izmene proizvoda"
          question={`Da li ste sigurni da zelite da izmenite podatke za proizvod ${editedProduct?.productName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default ModalEditProduct;
