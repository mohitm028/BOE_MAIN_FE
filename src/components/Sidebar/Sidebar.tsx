import type React from "react"
import Navigation from "./Navigation"
import { useLocation } from 'react-router-dom';
const Sidebar: React.FC = () => {

const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return null; // Don't render the sidebar on the login page
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-3">
        {/* Bank of America Flag Icon */}
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-6" viewBox="0 0 32 20" fill="none">
            <rect x="0" y="0" width="32" height="20" fill="#E53E3E" rx="1"/>
            <rect x="0" y="0" width="32" height="3" fill="#E53E3E"/>
            <rect x="0" y="4" width="32" height="3" fill="#FFFFFF"/>
            <rect x="0" y="8" width="32" height="3" fill="#E53E3E"/>
            <rect x="0" y="12" width="32" height="3" fill="#FFFFFF"/>
            <rect x="0" y="16" width="32" height="4" fill="#E53E3E"/>
          </svg>
        </div>
        <span className="text-xs text-gray-600 font-medium">BANK OF AMERICA</span>
      </div>
      <Navigation />
    </div>
  )
}

export default Sidebar
