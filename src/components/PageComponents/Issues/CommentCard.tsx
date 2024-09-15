import React, { useState } from "react";
import { Comments } from "../../../types/types";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import { handleApiError } from "../../../services/errorHandlers";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../Spinner";
import Modal from "../../Modal";
import { toast } from "react-toastify";

const CommentCard: React.FC<{ comments: Comments[]; fetchIssue: () => void }> = ({ comments, fetchIssue }) => {
  const { authUser } = useAuth();
  const [commentToDelete, setCommentToDelete] = useState<Comments | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const handleDeleteCommentOk: () => void = async () => {
    try {
      setShowSpinner(true);
      await axiosPrivate.delete(`/api/comments/${commentToDelete?.commentId}`);
      toast.success("Komentar je obrisan!", {
        position: "top-center",
      });
    } catch (err: any) {
      handleApiError(err);
    } finally {
      fetchIssue();
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleDeleteComment = (comment: Comments) => {
    setCommentToDelete(comment);
    setShowModal(true);
  };

  return (
    <>
      <div className="mt-2">
        <h5>Komentari: </h5>
        {comments?.map((comment) =>
          comments.length > 0 ? (
            <div key={`text-${comment?.commentId}`} className="bg-zinc-50 border-zinc-200 border-2 px-2 rounded-sm mb-2 grid grid-cols-2 lg:grid-cols-4 ">
              <div className="min-h-12 lg:col-span-3">
                <p>{comment?.commentText}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-4 py-2 justify-end">
                  <div>
                    <button className="button button-sky">Dokumenta</button>
                  </div>
                  {authUser && (comment.user.userId === authUser?.userId || authUser?.roles.some((role) => role.userRole.roleName === "Admin")) && (
                    <div>
                      <button className="button button-red" onClick={() => handleDeleteComment(comment)}>
                        Obriši
                      </button>
                    </div>
                  )}
                </div>

                <p>
                  {format(comment?.createdAt, "dd.MM.yyyy HH:mm")} : {comment?.user?.firstName} {comment?.user?.lastName}
                </p>
              </div>
            </div>
          ) : (
            <div className=" bg-zinc-100 border-zinc-300 border-2 px-2 rounded-lg mt-4 ">
              <div className="min-h-12">
                <p>Još uvek nema komentara...</p>
              </div>
            </div>
          )
        )}
      </div>
      {showSpinner && <Spinner />}
      {showModal && (
        <Modal
          onOK={handleDeleteCommentOk}
          onCancel={() => setShowModal(false)}
          title="Potvrda brisanja proizvoda"
          question={`Da li ste sigurni da zelite da obrišete komentar: ${commentToDelete?.commentText}?`}
        />
      )}
    </>
  );
};

export default CommentCard;
