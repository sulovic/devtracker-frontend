import React, { useState, useRef } from "react";
import Modal from "../../Modal";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAxiosPrivateFiles from "../../../hooks/useAxiosPrivateFiles";
import {
  allowedExtensions,
  maxNoOfFiles,
  maxFileSize,
} from "../../../config/config";
import { Comments, Documents } from "../../../types/types";
import useAuth from "../../../hooks/useAuth";
import { handleApiError } from "../../../services/errorHandlers";
import { AxiosInstance } from "axios";

const HandleFiles = ({
  selectedComment,
  isIssueResolved,
  setShowHandleFiles,
  fetchIssue,
}: {
  selectedComment: Comments;
  isIssueResolved: boolean;
  setShowHandleFiles: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIssue: () => void;
}): JSX.Element => {
  const [selectedFile, setSelectedFile] = useState<Documents | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(true);
  const [formFiles, setFormFiles] = useState<FormData>(new FormData());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const axiosPrivateFiles: AxiosInstance = useAxiosPrivateFiles();
  const { authUser } = useAuth();

  const handleFileClick = async (document: Documents): Promise<void> => {
    try {
      const response = await axiosPrivate.get(
        `uploads/${document?.documentUrl}`,
        { responseType: "blob" },
      );
      const blob = new Blob([response?.data], {
        type: response?.headers["content-type"] || "application/octet-stream",
      });
      const windowUrl = URL.createObjectURL(blob);
      const newWindow = window.open();

      if (newWindow) {
        newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pregled dokumenta ${document?.documentUrl}</title>
          <style>
            body {
              font-size: 48px;
             }

            @media only screen and (max-width: 767px) {
              body {
                font-size: 8px;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden;">
          <a href="${windowUrl}" download="${document?.documentUrl}">
            <img src="${windowUrl}" alt="${document?.documentUrl}" style="max-width: 100%; max-height: 100vh; width: auto; height: auto;">
          </a>
        </body>
        </html>
      `);
        newWindow.addEventListener("beforeunload", () => {
          // Clean up resources when the new window is about to be closed
          URL.revokeObjectURL(windowUrl);
        });
      } else {
        toast.error("Failed to open the new window.", {
          position: "top-center",
        });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (document: Documents): Promise<void> => {
    setSelectedFile(document);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = async () => {
    setShowDeleteModal(false);
  };

  const handleDeleteOk = async () => {
    setShowSpinner(true);
    try {
      // Delete file
      await axiosPrivate.delete(`api/uploads/${selectedFile?.documentId}`);

      toast.success("Datoteka je uspešno obrisana!", {
        position: "top-center",
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setShowSpinner(false);
      setShowDeleteModal(false);
      fetchIssue();
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setShowSpinner(true);

    try {
      // Check files for duplicates

      await axiosPrivateFiles.post(`api/uploads`, formFiles);

      toast.success(`Izmena je uspešno sačuvana !`, {
        position: "top-center",
      });
      setFormFiles(new FormData());
    } catch (error) {
      handleApiError(error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowSpinner(false);
      fetchIssue();
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      toast.warn(`Nema odabranih datoteka`, {
        position: "top-center",
      });
      return;
    }

    if (files.length > maxNoOfFiles) {
      toast.warn(`Možete dodati između 1 i 5 datoteka`, {
        position: "top-center",
      });
      return;
    }

    let hasInvalidFile = false;
    let invalidFileSize = false;

    Array.from(files).forEach((file) => {
      const fileExtension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        hasInvalidFile = true;
      }
      if (file.size > maxFileSize) {
        invalidFileSize = true;
      }
    });

    if (hasInvalidFile) {
      toast.warn(`Dozvoljene ekstenzije su: ${allowedExtensions.join(", ")}`, {
        position: "top-center",
      });
      return;
    }

    if (invalidFileSize) {
      toast.warn(
        `Maksimalna veličina datoteke je ${maxFileSize / 1024 / 1024} MB`,
        {
          position: "top-center",
        },
      );
      return;
    }

    const newFromData = new FormData();
    Array.from(files).forEach((file, index) => {
      newFromData.append(`file${index}`, file);
    });
    if (selectedComment?.commentId !== undefined) {
      newFromData.append("commentId", selectedComment?.commentId?.toString());
    }
    setFormFiles(newFromData);
    setError(false);
  };

  const handleCancel = () => {
    setShowHandleFiles(false);
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-zinc-800">
            <div className="w-full sm:mt-0">
              {/* Modal Head */}

              <h3>Pregled datoteka</h3>
              <div className="my-4 h-0.5 bg-zinc-400"></div>

              {/* Modal Body */}

              <div className="grid grid-cols-1">
                <h4>Prikačene datoteke: </h4>

                <div>
                  {selectedComment?.documents &&
                  selectedComment?.documents.length > 0 ? (
                    selectedComment?.documents.map((document, index) => (
                      <div
                        key={`document_${index}`}
                        className="my-4 flex items-center gap-4"
                      >
                        <p className="grow">{document?.documentUrl}</p>
                        <button
                          type="button"
                          className="button button-sky"
                          onClick={() => handleFileClick(document)}
                        >
                          Pogledaj
                        </button>
                        <button
                          type="button"
                          className="button button-red"
                          disabled={
                            !authUser?.roles.some(
                              (role) => role.userRole.roleName === "Admin",
                            ) ||
                            !(
                              authUser?.userId === selectedComment?.user?.userId
                            ) ||
                            isIssueResolved
                          }
                          onClick={() => handleDelete(document)}
                        >
                          Obriši
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Nema prikačenih datoteka...</p>
                  )}
                </div>
              </div>

              <h4>Dodaj nove datoteke: </h4>

              <div>
                <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                    handleSubmit(e)
                  }
                >
                  <div className="mt-2">
                    <div>
                      <input
                        required
                        ref={fileInputRef}
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleAddFiles(e)
                        }
                        id="addFilesForm"
                        disabled={
                          isIssueResolved ||
                          selectedComment?.user?.userId !== authUser?.userId
                        }
                        multiple
                        accept={allowedExtensions.join(", ")}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={
                          error ||
                          isIssueResolved ||
                          selectedComment?.user?.userId !== authUser?.userId
                        }
                        className="button button-sky ms-2"
                      >
                        Dodaj
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Buttons */}
              <div className="my-4 h-0.5 bg-zinc-400"></div>

              <div className="flex flex-row-reverse gap-2">
                <button
                  type="button"
                  className="button button-zinc"
                  onClick={handleCancel}
                >
                  Zatvori
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <Modal
          onOK={handleDeleteOk}
          onCancel={handleDeleteCancel}
          title="Potvrda brisanja datoteke"
          question={`Da li ste sigurni da želite da obrišete datoteku ${selectedFile?.documentUrl}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default HandleFiles;
