import React, { useState, useEffect } from "react";
import { Comments, Issue } from "../../../types/types";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import { handleApiError } from "../../../services/errorHandlers";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ModalNewComment from "./ModalNewComment";
import Spinner from "../../Spinner";
import Modal from "../../Modal";
import { toast } from "react-toastify";
import HandleFiles from "./HandleFiles";

const CommentsSection: React.FC<{ issue: Issue; fetchIssue: () => void }> = ({ issue, fetchIssue }) => {
  const { authUser } = useAuth();
  const [commentToDelete, setCommentToDelete] = useState<Comments | null>(null);
  const [showHandleFiles, setShowHandleFiles] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<Comments | null>(null);
  const [showModalNewComment, setShowModalNewComment] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  console.log(issue?.status?.statusName !== "Closed");

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

  useEffect(() => {
    setSelectedComment(issue.comments.find((comment) => comment.commentId === selectedComment?.commentId) || null);
  }, [issue.comments]);

  const handleDeleteComment = (comment: Comments) => {
    setCommentToDelete(comment);
    setShowModal(true);
  };

  return (
    <>
      <div className="mt-2">
        <h5>Komentari: </h5>
        {issue?.comments?.length > 0 ? (
          issue?.comments?.map((comment) => (
            <div key={`text-${comment?.commentId}`} className="bg-zinc-50 border-zinc-200 border-2 px-2 rounded-sm mb-2 grid grid-cols-2 lg:grid-cols-4 ">
              <div className="min-h-12 lg:col-span-3">
                <p>{comment?.commentText}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-4 py-2 justify-end">
                  <div>
                    <button
                      onClick={() => {
                        setSelectedComment(comment);
                        setShowHandleFiles(true);
                      }}
                      className="button button-sky"
                    >
                      Dokumenta : {comment?.documents?.length}
                    </button>
                  </div>
                  {authUser &&
                    (comment?.user?.userId === authUser?.userId || authUser?.roles.some((role) => role?.userRole?.roleName === "Admin")) &&
                    issue?.status?.statusName !== "Closed" && (
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
          ))
        ) : (
          <div className=" bg-zinc-100 border-zinc-300 border-2 px-2 rounded-lg mt-4 ">
            <div className="min-h-12">
              <p>Još uvek nema komentara...</p>
            </div>
          </div>
        )}
        <div>
          <div className="flex justify-end py-4">
            <button
              type="button"
              className="button button-sky"
              disabled={issue?.status?.statusName === "Closed"}
              aria-label="New Comment"
              onClick={() => setShowModalNewComment(true)}
            >
              Dodaj komentar
            </button>
          </div>
        </div>
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
      {showHandleFiles && selectedComment && (
        <HandleFiles
          selectedComment={selectedComment}
          isIssueResolved={issue?.status?.statusName === "Closed"}
          setShowHandleFiles={setShowHandleFiles}
          fetchIssue={fetchIssue}
        />
      )}
      {showModalNewComment && issue && <ModalNewComment setShowModalNewComment={setShowModalNewComment} fetchIssue={fetchIssue} issue={issue} />}
    </>
  );
};

export default CommentsSection;
