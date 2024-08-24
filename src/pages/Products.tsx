import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { DashboardLinks } from "../config/config";
import ModalNewProduct from "../components/PageComponents/Products/ModalNewProduct";
import ModalEditProduct from "../components/PageComponents/Products/ModalEditProduct";
import type { AuthContextType, Product } from "../types/types";
import { handleApiError } from "../services/errorHandlers";

const Products: React.FC = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showModalNewProduct, setShowModalNewProduct] = useState<boolean>(false);
  const [showModalEditProduct, setShowModalEditProduct] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } : AuthContextType = useAuth();
  const tableHeaders = ["Proizvod", "Izmeni", "Obriši"];

  const fetchProducts: () => void = async () => {
    try {
      setShowSpinner(true);
      const productsResponse: { data: Product[] } = await axiosPrivate.get("/api/products");
      setProductsData(productsResponse?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete: (product: Product) => void = (product) => {
    setSelectedProduct(product);
    setShowModalDelete(true);
  };

  const handleDeleteOK: () => void = async () => {
    try {
      setShowSpinner(true);
      const deleteProductRespose: { data: Product } = await axiosPrivate.delete(`/api/products/${selectedProduct?.productId}`);

      toast.success(`Proizvod ${deleteProductRespose?.data?.productName} je uspešno obrisan!`, {
        position: "top-center",
      });
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSelectedProduct(null);
      setShowSpinner(false);
      setShowModalDelete(false);
      fetchProducts();
    }
  };

  const handleDeleteCancel: () => void = () => {
    setSelectedProduct(null);
    setShowModalDelete(false);
  };

  const handleEditProduct: (product: Product) => void = (product: Product) => {
    setSelectedProduct(product);
    setShowModalEditProduct(true);
  };

  return (
    <>
      <Navbar Links={DashboardLinks} />
      <div className="mx-2 md:mx-4">
        <h3 className="mt-4">Proizvodi</h3>
        <>
          <div className="flex justify-end px-3">
            <button type="button" className="button button-sky " aria-label="Dodaj proizvod" onClick={() => setShowModalNewProduct(true)}>
              Dodaj proizvod
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
                    {productsData.length
                      ? productsData.map((product, index) => (
                          <tr key={index} className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                            <td key={`productName${index}`}>{product?.productName}</td>
                            <td key={`edit_${index}`} className="text-center">
                              <button type="button" className="button button-sky" aria-label="Edit" onClick={() => handleEditProduct(product)}>
                                Izmeni
                              </button>
                            </td>
                            <td key={`delete_${index}`} className="text-center">
                              <button
                                type="button"
                                className="button button-red"
                                aria-label="Delete"
                                disabled={!authUser?.roles.some((role) => role?.roleId > 5000)}
                                onClick={() => handleDelete(product)}
                              >
                                Obriši
                              </button>
                            </td>
                          </tr>
                        ))
                      : !showSpinner && (
                          <tr>
                            <td colSpan={3} className="p-3">
                              Nema podataka o proizvodima...
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
                {/* Modal and Spinner component */}
              </div>
            </div>
          </div>
        </>
      </div>
      {showSpinner && <Spinner />}
      {showModalNewProduct && <ModalNewProduct setShowModalNewProduct={setShowModalNewProduct} fetchProducts={fetchProducts} />}
      {showModalEditProduct && selectedProduct && (
        <ModalEditProduct setShowModalEditProduct={setShowModalEditProduct} fetchProducts={fetchProducts} selectedProduct={selectedProduct} />
      )}
      {showModalDelete && (
        <Modal
          onOK={handleDeleteOK}
          onCancel={handleDeleteCancel}
          title="Potvrda brisanja proizvoda"
          question={`Da li ste sigurni da zelite da obrišete proizvod ${selectedProduct?.productName}?`}
        />
      )}
    </>
  );
};

export default Products;
