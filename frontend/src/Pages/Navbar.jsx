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
    `rounded-lg px-3 py-2 text-sm duration-200 hover:bg-white/[0.06] hover:text-white ${
      isActive ? "bg-violet-400/10 text-violet-200" : "text-gray-400"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2.5 text-sm duration-200 hover:bg-white/[0.06] hover:text-white ${
      isActive ? "bg-violet-400/10 text-violet-200" : "text-gray-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#30384b]/70 bg-[#0b0e16]/85 backdrop-blur-xl no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-8">
        {/* Logo */}
        <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-3">
          <span className="robot-mark relative h-10 w-10 overflow-hidden rounded-xl shadow-lg" aria-hidden="true">
            <img
              src="/jobgenie-robot.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
            />
          </span>
          <span className="text-2xl font-bold tracking-tight bg-[linear-gradient(to_right,#a68bff,#7367f5)] bg-clip-text text-transparent md:text-[1.7rem]">
            JobGenie
          </span>
        </Link>

        {/* Desktop Navbar Links */}
        <div className="hidden items-center gap-1 font-semibold md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to="/home" className={navLinkClass}>Home</NavLink>
              <NavLink to="/generate" className={navLinkClass}>Generate</NavLink>
              <NavLink to="/score" className={navLinkClass}>Score</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Find Jobs</NavLink>
            </>
          ) : (
            <>
              <a href="#features" className="rounded-lg px-3 py-2 text-sm text-gray-400 duration-200 hover:bg-white/[0.06] hover:text-white">Features</a>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-gray-400 duration-200 hover:bg-white/[0.06] hover:text-white">Log in</Link>
            </>
          )}
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-200 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/signup"
              className="flex items-center gap-2 rounded-lg bg-[#7367f5] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#8176ff] active:scale-95"
            >
              Sign up
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-gray-300 transition-colors hover:bg-white/[0.08] hover:text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute w-full border-b border-[#30384b] bg-[#111827] px-4 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.45)] animate-in slide-in-from-top-2 duration-300 md:hidden flex flex-col gap-2 font-semibold">
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
              <a href="#features" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm text-gray-400 duration-200 hover:bg-white/[0.06] hover:text-white">Features</a>
              <Link to="/login" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Log in</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7367f5] px-4 py-3 text-sm font-semibold text-white duration-200 hover:bg-[#8176ff]">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;