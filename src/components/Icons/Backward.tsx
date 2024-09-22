import React from "react";

const Backward: React.FC<{ IconClick: () => void }> = ({ IconClick }) => {
  return (
    <div className="flex items-center gap-2" onClick={() => IconClick()}>
      <svg
        className="w-6 fill-zinc-600 lg:w-8 dark:fill-white"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="fill-zinc-600"
        viewBox="0 0 16 16"
      >
        <path d="M9.196 8 15 4.633v6.734zm-.792-.696a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z" />
        <path d="M1.196 8 7 4.633v6.734zm-.792-.696a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z" />
      </svg>
      <h3>Nazad</h3>
    </div>
  );
};

export default Backward;
