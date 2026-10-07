import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-[10px] text-lg px-2 py-1 duration-300 hover:bg-white/10 hover:text-white ${
      isActive ? "bg-white/10 text-blue-400" : "text-gray-400"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block rounded-lg text-lg px-4 py-2 duration-300 hover:bg-white/10 hover:text-white ${
      isActive ? "bg-white/10 text-blue-400" : "text-gray-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 w-full no-print">
      <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-3">
          <span className="robot-mark relative h-10 w-10 overflow-hidden rounded-xl shadow-lg" aria-hidden="true">
            <img
              src="/jobgenie-robot.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
            />
          </span>
          <span className="text-2xl md:text-3xl font-bold bg-[linear-gradient(to_right,#9333ea,#06b6d4)] bg-clip-text text-transparent">
            JobGenie
          </span>
        </Link>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex gap-5 font-semibold">
          {isAuthenticated ? (
            <>
              <NavLink to="/home" className={navLinkClass}>Home</NavLink>
              <NavLink to="/generate" className={navLinkClass}>Generate</NavLink>
              <NavLink to="/score" className={navLinkClass}>Score</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Find Jobs</NavLink>
            </>
          ) : (
            <>
              <a href="#features" className="rounded-[10px] text-lg px-2 py-1 text-gray-400 duration-300 hover:bg-white/10 hover:text-white">Features</a>
              <Link to="/login" className="rounded-[10px] text-lg px-2 py-1 text-gray-400 duration-300 hover:bg-white/10 hover:text-white">Log in</Link>
            </>
          )}
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[linear-gradient(to_right,#9333ea,#06b6d4)] px-4 py-2 text-white rounded-lg cursor-pointer active:scale-95 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] font-semibold duration-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-[linear-gradient(to_right,#9333ea,#06b6d4)] px-4 py-2 text-white rounded-lg active:scale-95 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] font-semibold duration-300 transition-all"
            >
              Sign up
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none transition-colors p-2 bg-white/5 rounded-lg border border-white/10">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0c] border-b border-white/10 px-4 py-5 flex flex-col gap-2 font-semibold absolute w-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-2 duration-300">
          {isAuthenticated ? (
            <>
              <NavLink to="/home" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Home</NavLink>
              <NavLink to="/generate" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Generate Resume</NavLink>
              <NavLink to="/score" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Score Resume</NavLink>
              <NavLink to="/jobs" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Find Jobs</NavLink>
              <div className="h-px bg-white/10 my-2 w-full"></div>
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="flex items-center justify-center gap-2 bg-[linear-gradient(to_right,#9333ea,#06b6d4)] px-4 py-3 text-white rounded-lg cursor-pointer font-semibold duration-300 w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout Account
              </button>
            </>
          ) : (
            <>
              <a href="#features" onClick={() => setIsOpen(false)} className="block rounded-lg text-lg px-4 py-2 text-gray-400 duration-300 hover:bg-white/10 hover:text-white">Features</a>
              <Link to="/login" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Log in</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-[linear-gradient(to_right,#9333ea,#06b6d4)] px-4 py-3 text-white rounded-lg font-semibold duration-300 w-full">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;