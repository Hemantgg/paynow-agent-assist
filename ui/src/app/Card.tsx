import React from "react";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);
