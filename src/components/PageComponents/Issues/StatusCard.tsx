import React from "react";

const StatusCard: React.FC<{ title: String; desc: string | undefined }> = ({ title, desc }) => {
  return (
    <div className="min-h-24 bg-sky-50 border-sky-400 border-2 px-2 rounded-lg relative">
      <h4 className="text-sky-500 font-medium">{title}</h4>
      <h5 className="text-sky-500 font-medium">{desc ? desc : ""}</h5>
    </div>
  );
};

export default StatusCard;
