import React from "react";

const Forward: React.FC<{ IconClick: () => void }> = ({ IconClick }) => {
  return (
    <div className="w-6 lg:w-8 fill-zinc-600" onClick={() => IconClick()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="fill-zinc-600" viewBox="0 0 16 16">
        <path d="M6.804 8 1 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z" />
        <path d="M14.804 8 9 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z" />
      </svg>
    </div>
  );
};

export default Forward;
