import React from "react";

const StatusCard: React.FC<{ title: String; desc: string | undefined }> = ({
  title,
  desc,
}) => {
  return (
    <div className="relative rounded-sm border-2 border-sky-300 bg-sky-50 px-2 py-2 dark:border-zinc-600 dark:bg-zinc-800">
      <h4 className="font-medium text-sky-500">{title}</h4>
      <h5 className="font-medium text-sky-500">{desc ? desc : ""}</h5>
    </div>
  );
};

export default StatusCard;
