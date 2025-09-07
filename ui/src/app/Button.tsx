import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold disabled:opacity-50"
    {...props}
  >
    {children}
  </button>
);
