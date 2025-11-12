import React from "react";

export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="rounded-lg bg-[#de6515] px-4 py-2 text-white hover:opacity-90">
    {children}
  </button>
);
