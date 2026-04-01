import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <svg
        className="animate-spin h-6 w-6 text-[#000492]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v5.373A5.373 5.373 0 005.373 12H4z"
        ></path>
      </svg>
    </div>
  );
}

export default Spinner;