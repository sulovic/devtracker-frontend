import React, { useState } from "react";
import Modal from "../../Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import { toast } from "react-toastify";
import { AxiosInstance } from "axios";
import { handleApiError } from "../../../services/errorHandlers";
import { useAuth } from "../../../Context/AuthContext";
import { AuthContextType, Comments, Issue } from "../../../types/types";

const ModalNewComment: React.FC<{ issue: Issue; setShowModalNewComment: React.Dispatch<React.SetStateAction<boolean>>; fetchIssue: () => void }> = ({
  issue,
  setShowModalNewComment,
  fetchIssue,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const [newComment, setNewComment] = useState<Comments>({
    commentText: "",
    createdAt: new Date(),
    user: authUser || {
      userId: 0,
      firstName: "",
      lastName: "",
      email: "",
      roles: [],
    },
    documents: [],
    issueId: issue?.issueId,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmitOK = async () => {
    try {
      setShowSpinner(true);
      await axiosPrivate.post("/api/comments", newComment);
      toast.success("Komentar je uspešno dodat!", {
        position: "top-center",
      });
    } catch (err: any) {
      handleApiError(err);
    } finally {
      fetchIssue();
      setShowSpinner(false);
      setShowModal(false);
      setShowModalNewComment(false);
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
                <h4>Dodavanje novog komentara</h4>
                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
                {/* Modal Body */}
                <div className="my-2">
                  <h5>Zahtev: {issue?.issueName}</h5>
                </div>
                <div className="grid grid-cols-1">
                  <div>
                    <label htmlFor="issueDesc">Novi komentar</label>
                    <textarea
                      id="commentText"
                      aria-describedby="New Comment"
                      value={newComment?.commentText}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment({ ...newComment, [e.target.id]: e.target.value })}
                      maxLength={512}
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
              <button type="button" className="button button-gray" onClick={() => setShowModalNewComment(false)}>
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
          title="Potvrda dodavanje novog korisnika"
          question={`Da li ste sigurni da zelite da dodate novi komentar na zahtev ${issue?.issueName}?`}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default ModalNewComment;
