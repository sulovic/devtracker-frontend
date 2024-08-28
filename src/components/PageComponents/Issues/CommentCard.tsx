import React from "react";
import { Comments } from "../../../types/types";
import { format } from "date-fns";

const CommentCard: React.FC<{ comments: Comments[] }> = ({ comments }) => {
  return comments?.map((comment) =>
    comments.length > 0 ? (
      <div key={`text-${comment?.commentId}`} className="bg-zinc-100 border-zinc-300 border-2 px-2 rounded-lg mt-4 grid grid-cols-2 lg:grid-cols-4 ">
        <div className="min-h-12 lg:col-span-3">
          <p>Komentar: {comment?.commentText}</p>
        </div>
        <div className="text-right">
          <p>Dokumenta</p>
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
  );
};

export default CommentCard;
