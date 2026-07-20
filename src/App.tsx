import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./components/ui/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Public Views
import { HomeView } from "./components/public/HomeView";
import { ProfileView } from "./components/public/ProfileView";
import { EducationView } from "./components/public/EducationView";
import { NewsView } from "./components/public/NewsView";
import { NewsDetailView } from "./components/public/NewsDetailView";
import { AgendaView } from "./components/public/AgendaView";
import { GalleryView } from "./components/public/GalleryView";
import { PPDBView } from "./components/public/PPDBView";
import { DonationView } from "./components/public/DonationView";
import { ContactView } from "./components/public/ContactView";
import { LoginView } from "./components/public/LoginView";

// Admin Views
import { AdminDashboard } from "./components/admin/AdminDashboard";

// Layout wrapper to handle conditional rendering of public header/footer
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin") || location.pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden font-sans">
      {/* Background ambient glowing circles for Frosted Glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[30%] left-[-5%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {!isAdminPath && <Navbar />}
        
        <div className="flex-1">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomeView />} />
            <Route path="/profil" element={<ProfileView />} />
            <Route path="/pendidikan" element={<EducationView />} />
            <Route path="/berita" element={<NewsView />} />
            <Route path="/berita/:slug" element={<NewsDetailView />} />
            <Route path="/agenda" element={<AgendaView />} />
            <Route path="/galeri" element={<GalleryView />} />
            <Route path="/ppdb" element={<PPDBView />} />
            <Route path="/donasi" element={<DonationView />} />
            <Route path="/kontak" element={<ContactView />} />
            <Route path="/login" element={<LoginView />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Catch-all route -> redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {!isAdminPath && <Footer />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
