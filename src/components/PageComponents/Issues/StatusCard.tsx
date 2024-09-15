import React from "react";

const StatusCard: React.FC<{ title: String; desc: string | undefined }> = ({ title, desc }) => {
  return (
    <div className=" bg-sky-50 border-sky-300 border-2 px-2 py-2 rounded-sm relative">
      <h4 className="text-sky-500 font-medium">{title}</h4>
      <h5 className="text-sky-500 font-medium">{desc ? desc : ""}</h5>
    </div>
  );
};

export default StatusCard;
