import { ReactNode } from "react";

export const DropdownMenu = ({ children }: { children: ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

export const DropdownMenuTrigger = ({ children }: { children: ReactNode }) => {
  return <button className="px-4 py-2 bg-blue-500 text-white rounded">{children}</button>;
};

export const DropdownMenuContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      {children}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string; // ✅ Add this
}

export const DropdownMenuItem = ({ children, onClick, className }: DropdownMenuItemProps) => {
  return (
    <div onClick={onClick} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className || ''}`}>
      {children}
    </div>
  );
};

