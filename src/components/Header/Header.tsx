import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings } from "lucide-react";
import { UserDropdown } from "../Pages/UserDropdown";
import {ShoppingCard} from "../Pages/ShoppingCard";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
 
  // Close menu when clicking outside
  useEffect(() => {
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-white px-6 py-3 border-b border-gray-200">
      <div className="flex justify-between items-center">
        {/* Left side - Title with Flag Icon */}
        <div className="flex items-center gap-3">
          {/* Bank of America Flag Icon */}
          
          {/* Title */}
          <div className="text-gray-700 text-sm font-medium">
            Enterprise Job Scheduling
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3">
          {/* Shopping cart icon */}
         
           <button
            onClick={() => navigate("/shopping-card")}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
           </button>
          {/* Notification icon with badge */}
         

          {/* Settings icon */}
          

          {/* User avatar with dropdown */}
           <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;