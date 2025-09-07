import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-medium text-sm">
      {label}
    </label>
    <input
      id={id}
      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);
