import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowLeft, LogIn } from "lucide-react";
import { useApp } from "../ui/AppContext";

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login, admin, showToast } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin immediately
  useEffect(() => {
    if (admin) {
      navigate("/admin");
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Harap isi alamat email dan kata sandi.", "warning");
      return;
    }

    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) {
      navigate("/admin");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left">
      
      {/* Return to Home link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Emblem Brand */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-800 to-green-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-primary-700/20 mb-4">
          AG
        </div>
        
        <h2 className="text-center text-3xl font-display font-extrabold text-gray-900 tracking-tight leading-none">
          Login Administrator
        </h2>
        <p className="mt-2 text-center text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
          Gunakan kredensial resmi pengurus untuk masuk dan mengelola konten Website Resmi Al-Ghuroba.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-gray-700 block">Alamat Email Resmi</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@alghuroba.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-xs font-bold text-gray-700">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => showToast("Harap hubungi kepala seksi kesekretariatan untuk melakukan pemulihan kata sandi (Forgot Password).", "info")}
                  className="text-[10px] font-semibold text-primary-800 hover:text-primary-900"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800"
                  required
                />
              </div>
            </div>

            {/* Login button submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary-800 hover:bg-primary-900 shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200 cursor-pointer"
            >
              <LogIn className="w-4.5 h-4.5" />
              {loading ? "Sedang Autentikasi..." : "Masuk ke Dashboard"}
            </button>

          </form>

          {/* Quick Notice with Credentials info */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100/50 text-[11px] text-primary-900 leading-relaxed space-y-1">
              <p className="font-bold uppercase tracking-wider text-xs">Petunjuk Pengujian:</p>
              <p>Wali/Pengunjung tidak memerlukan login asrama.</p>
              <p>Untuk login admin asrama, gunakan kredensial berikut:</p>
              <p>• Email: <span className="font-mono font-bold">admin@alghuroba.id</span></p>
              <p>• Password: <span className="font-mono font-bold">Admin123!</span></p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
