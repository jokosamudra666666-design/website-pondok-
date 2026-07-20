import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldAlert, LogIn, LayoutDashboard, UserCheck } from "lucide-react";
import { useApp } from "../ui/AppContext";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { admin } = useApp();
  const location = useLocation();

  const menuItems = [
    { label: "Beranda", path: "/" },
    { label: "Profil", path: "/profil" },
    { label: "Pendidikan", path: "/pendidikan" },
    { label: "Berita", path: "/berita" },
    { label: "Agenda", path: "/agenda" },
    { label: "Galeri", path: "/galeri" },
    { label: "PPDB", path: "/ppdb" },
    { label: "Donasi", path: "/donasi" },
    { label: "Kontak", path: "/kontak" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md border border-white/20 group-hover:scale-105 transition-transform duration-200">
              AG
            </div>
            <div>
              <span className="block font-display font-bold text-white leading-tight tracking-tight group-hover:text-amber-400 transition-colors">
                Al-Ghuroba
              </span>
              <span className="block text-[10px] font-medium text-amber-400 tracking-wider uppercase">
                Lirboyo, Kediri
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive(item.path)
                    ? "text-white bg-white/12 border-white/15 font-semibold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border-transparent hover:border-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Admin / Portal Action */}
          <div className="hidden xl:flex items-center gap-3">
            {admin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border border-white/10 shadow-md transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Login Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-3">
            {/* Quick Admin Indicator on Mobile */}
            {admin && (
              <Link to="/admin" className="p-2 text-white bg-white/10 rounded-xl border border-white/10">
                <UserCheck className="w-5 h-5" />
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Slide-in Navigation */}
      {isOpen && (
        <div className="xl:hidden bg-[#0f172ab0] backdrop-blur-2xl border-b border-white/10 py-4 px-4 space-y-1.5 animate-fade-in relative z-50">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive(item.path)
                  ? "text-white bg-white/15 border border-white/10 font-bold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
            {admin ? (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 border border-white/10 shadow-md"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard Admin
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10"
              >
                <LogIn className="w-5 h-5" />
                Login Administrator
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
