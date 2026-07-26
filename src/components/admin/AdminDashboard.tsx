import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Calendar, Image as ImageIcon, Sliders, FileText,
  Users, Settings, ShieldAlert, LogOut, Plus, Edit, Trash2, Search,
  TrendingUp, Check, X, Eye, FileDown, RefreshCw, Activity, UserPlus, Info, CheckCircle
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useApp } from "../ui/AppContext";
import { apiService } from "../../services/api";
import { ImageUploader } from "../ui/ImageUploader";
import { INews, IEvent, IGallery, IBanner, IPage, IAdmin, ILog, ICategory, IDonation } from "../../types";
import { SkeletonTable } from "../ui/Skeleton";
// @ts-ignore
import logoImg from "../../assets/images/al_ghuroba_logo_1784517143166.jpg";

type TabID = "dashboard" | "news" | "events" | "gallery" | "banner" | "pages" | "admins" | "settings" | "logs";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout, showToast, settings, refreshSettings } = useApp();

  const [activeTab, setActiveTab] = useState<TabID>("dashboard");
  const [loading, setLoading] = useState(true);

  // States for DB Collections
  const [news, setNews] = useState<INews[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [galleries, setGalleries] = useState<IGallery[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [pages, setPages] = useState<IPage[]>([]);
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [logs, setLogs] = useState<ILog[]>([]);
  const [donations, setDonations] = useState<IDonation[]>([]);

  // Search & Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  // Edit / Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formType, setFormType] = useState<"news" | "event" | "gallery" | "banner" | "admin" | "donation" | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!admin) {
      navigate("/login");
    }
  }, [admin, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        newsRes, catsRes, eventsRes, galRes,
        bannersRes, pagesRes, adminsRes, logsRes, donRes
      ] = await Promise.all([
        apiService.getNews(),
        apiService.getCategories(),
        apiService.getEvents(),
        apiService.getGalleries(),
        apiService.getBanners(),
        apiService.getPages(),
        apiService.getAdmins(),
        apiService.getLogs(),
        apiService.getDonations()
      ]);

      if (newsRes.success) setNews(newsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (galRes.success) setGalleries(galRes.data);
      if (bannersRes.success) setBanners(bannersRes.data);
      if (pagesRes.success) setPages(pagesRes.data);
      if (adminsRes.success) setAdmins(adminsRes.data);
      if (logsRes.success) setLogs(logsRes.data);
      if (donRes.success) setDonations(donRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showToast("Gagal memuat data dashboard.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadDashboardData();
    }
  }, [admin]);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari dashboard asrama?")) {
      logout();
      navigate("/");
    }
  };

  // --- CRUD ACTIONS ---

  const handleDelete = async (id: string, type: "news" | "event" | "gallery" | "banner" | "admin" | "donation") => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data ini secara permanen? (BR-006 / BR-026)`)) {
      return;
    }

    try {
      let res;
      if (type === "news") res = await apiService.deleteNews(id);
      else if (type === "event") res = await apiService.deleteEvent(id);
      else if (type === "gallery") res = await apiService.deleteGallery(id);
      else if (type === "banner") res = await apiService.deleteBanner(id);
      else if (type === "admin") res = await apiService.deleteAdmin(id);
      else if (type === "donation") res = await apiService.deleteDonation(id);

      if (res?.success) {
        showToast(res.message || "Data berhasil dihapus.", "success");
        loadDashboardData();
      }
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus data.", "error");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (formType === "news") {
        if (!editItem.title || !editItem.content) {
          showToast("Judul dan isi berita wajib diisi! (BR-003)", "warning");
          return;
        }
        if (isEditing) {
          res = await apiService.updateNews(editItem.id, editItem);
        } else {
          res = await apiService.createNews(editItem);
        }
      } else if (formType === "event") {
        if (!editItem.title || !editItem.startDate || !editItem.location) {
          showToast("Judul, Tanggal, dan Lokasi wajib diisi!", "warning");
          return;
        }
        if (isEditing) {
          res = await apiService.updateEvent(editItem.id, editItem);
        } else {
          res = await apiService.createEvent(editItem);
        }
      } else if (formType === "gallery") {
        if (!editItem.title || !editItem.image) {
          showToast("Judul dan Gambar wajib diisi!", "warning");
          return;
        }
        res = await apiService.createGallery(editItem);
      } else if (formType === "banner") {
        if (!editItem.title || !editItem.image) {
          showToast("Judul dan Gambar wajib diisi!", "warning");
          return;
        }
        if (isEditing) {
          res = await apiService.updateBanner(editItem.id, editItem);
        } else {
          res = await apiService.createBanner(editItem);
        }
      } else if (formType === "admin") {
        if (!editItem.name || !editItem.email || !editItem.role) {
          showToast("Nama, Email, dan Hak Akses wajib diisi!", "warning");
          return;
        }
        if (isEditing) {
          res = await apiService.updateAdmin(editItem.uid, editItem);
        } else {
          res = await apiService.createAdmin(editItem);
        }
      } else if (formType === "donation") {
        if (!editItem.title || !editItem.bank || !editItem.accountNumber) {
          showToast("Data Rekening wajib diisi!", "warning");
          return;
        }
        if (isEditing) {
          res = await apiService.updateDonation(editItem.id, editItem);
        } else {
          res = await apiService.createDonation(editItem);
        }
      }

      if (res?.success) {
        showToast(res.message || "Data berhasil disimpan.", "success");
        setIsEditing(false);
        setEditItem(null);
        setFormType(null);
        loadDashboardData();
      }
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan data.", "error");
    }
  };

  const handleEditInit = (item: any, type: typeof formType) => {
    setEditItem({ ...item });
    setIsEditing(true);
    setFormType(type);
  };

  const handleCreateInit = (type: typeof formType) => {
    setIsEditing(false);
    setFormType(type);
    if (type === "news") {
      setEditItem({ title: "", content: "", excerpt: "", categoryId: "cat-1", published: true, tags: [] });
    } else if (type === "event") {
      setEditItem({ title: "", description: "", location: "", startDate: new Date().toISOString().substring(0, 16), endDate: "", image: "" });
    } else if (type === "gallery") {
      setEditItem({ title: "", image: "", category: "Kegiatan", description: "" });
    } else if (type === "banner") {
      setEditItem({ title: "", subtitle: "", image: "", buttonText: "", buttonLink: "", order: banners.length + 1, isActive: true });
    } else if (type === "admin") {
      setEditItem({ name: "", email: "", role: "admin", isActive: true });
    } else if (type === "donation") {
      setEditItem({ title: "", description: "", bank: "Bank Syariah Indonesia (BSI)", accountNumber: "", accountName: "PP AL GHUROBA", qris: "", isActive: true });
    }
  };

  // Static Settings Form state handler
  const [settingsForm, setSettingsForm] = useState<any>(null);
  useEffect(() => {
    if (settings) {
      setSettingsForm({ ...settings });
    }
  }, [settings]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.updateSettings(settingsForm);
      if (res.success) {
        showToast("Pengaturan umum website berhasil diperbarui!", "success");
        await refreshSettings();
        loadDashboardData();
      }
    } catch (err: any) {
      showToast(err.message || "Gagal memperbarui pengaturan.", "error");
    }
  };

  // Static pages form state handler
  const [activePageEdit, setActivePageEdit] = useState<IPage | null>(null);
  const handlePageSelect = (page: IPage) => {
    setActivePageEdit({ ...page });
  };
  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePageEdit) return;
    try {
      const res = await apiService.updatePage(activePageEdit.slug, activePageEdit);
      if (res.success) {
        showToast("Konten halaman berhasil disimpan!", "success");
        setActivePageEdit(null);
        loadDashboardData();
      }
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan konten halaman.", "error");
    }
  };

  // Recharts Chart Mock Data representing Page Views across current week
  const chartData = [
    { name: "Senin", Pengunjung: 450, Berita: 310 },
    { name: "Selasa", Pengunjung: 520, Berita: 340 },
    { name: "Rabu", Pengunjung: 610, Berita: 400 },
    { name: "Kamis", Pengunjung: 580, Berita: 420 },
    { name: "Jumat", Pengunjung: 730, Berita: 510 },
    { name: "Sabtu", Pengunjung: 820, Berita: 590 },
    { name: "Minggu", Pengunjung: 950, Berita: 640 },
  ];

  if (!admin) return null;

  return (
    <div className="bg-gray-100 min-h-screen flex text-left">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-gray-300 z-10 shrink-0">
        
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-gray-800 gap-3">
          <img 
            src={settings?.logo || logoImg} 
            alt={settings?.siteName || "Logo Al-Ghuroba"} 
            className="w-8 h-8 object-contain" 
            referrerPolicy="no-referrer" 
          />
          <div>
            <span className="block font-display font-extrabold text-white leading-tight">Admin Asrama</span>
            <span className="block text-[9px] font-semibold text-gold-500 uppercase tracking-widest">AL-GHUROBA</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "news", label: "Kelola Berita", icon: BookOpen },
            { id: "events", label: "Kelola Agenda", icon: Calendar },
            { id: "gallery", label: "Kelola Galeri", icon: ImageIcon },
            { id: "banner", label: "Kelola Banner", icon: Sliders },
            { id: "pages", label: "Kelola Halaman", icon: FileText },
            { id: "admins", label: "Kelola Admin", icon: Users, superOnly: true },
            { id: "settings", label: "Pengaturan Web", icon: Settings },
            { id: "logs", label: "Audit Logs", icon: ShieldAlert },
          ].map((link) => {
            if (link.superOnly && admin.role !== "super_admin") return null;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id as any);
                  setFormType(null);
                  setActivePageEdit(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === link.id
                    ? "bg-primary-800 text-white shadow-sm"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Logged in Profile bottom details */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3">
            <img src={admin.photoURL} alt={admin.name} className="w-10 h-10 rounded-full object-cover border border-gray-800" />
            <div className="overflow-hidden">
              <span className="block text-sm font-bold text-white truncate">{admin.name}</span>
              <span className="block text-[10px] text-gray-500 uppercase tracking-widest truncate">{admin.role === "super_admin" ? "Super Admin" : "Editor"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full justify-center px-4 py-2 rounded-xl text-xs font-bold text-red-400 border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Akun
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER HEADER */}
        <header className="flex h-16 items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4">
            {/* Display active tab title */}
            <h1 className="font-display font-extrabold text-gray-900 text-lg md:text-xl uppercase tracking-wider">
              {activeTab === "dashboard" && "Dashboard Pengawasan"}
              {activeTab === "news" && "Kelola Berita & Publikasi"}
              {activeTab === "events" && "Kelola Agenda Kegiatan"}
              {activeTab === "gallery" && "Kelola Galeri Foto"}
              {activeTab === "banner" && "Kelola Slide Banner"}
              {activeTab === "pages" && "Kelola Isi Halaman"}
              {activeTab === "admins" && "Kelola Administrator"}
              {activeTab === "settings" && "Pengaturan Umum"}
              {activeTab === "logs" && "Audit Logs & Aktivitas"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:block">
              Keamanan Terverifikasi
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping hidden md:block" />
            
            {/* Quick Home action for previewers */}
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary-800 bg-primary-50 hover:bg-primary-100 rounded-xl"
            >
              Lihat Website
            </button>
          </div>
        </header>

        {/* INNER SCROLLABLE WORKSPACE */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {loading ? (
            <SkeletonTable />
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Total Berita", val: news.length, color: "border-primary-100 bg-primary-50/50 text-primary-900" },
                      { label: "Agenda Terdaftar", val: events.length, color: "border-blue-100 bg-blue-50/50 text-blue-900" },
                      { label: "Foto Galeri", val: galleries.length, color: "border-purple-100 bg-purple-50/50 text-purple-900" },
                      { label: "Slide Banner", val: banners.length, color: "border-amber-100 bg-amber-50/50 text-amber-900" },
                    ].map((card, i) => (
                      <div key={i} className={`p-5 rounded-2xl border shadow-xs flex items-center justify-between ${card.color}`}>
                        <div className="space-y-1">
                          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</span>
                          <span className="block text-3xl font-display font-extrabold">{card.val}</span>
                        </div>
                        <Activity className="w-8 h-8 opacity-25" />
                      </div>
                    ))}
                  </div>

                  {/* CHART & STATS ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Traffic Chart */}
                    <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h3 className="font-display font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary-800" />
                          Grafik Pengunjung (Mingguan)
                        </h3>
                        <span className="text-[10px] bg-primary-50 text-primary-800 font-bold px-2 py-0.5 rounded-md uppercase">Harian</span>
                      </div>
                      
                      <div className="h-72 w-full text-xs font-semibold">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#166534" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="Pengunjung" stroke="#166534" fillOpacity={1} fill="url(#colorViews)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="font-display font-bold text-gray-900 text-sm md:text-base border-b border-gray-100 pb-3">
                          Aksi Cepat Menu
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <button
                            onClick={() => { setActiveTab("news"); handleCreateInit("news"); }}
                            className="p-3 rounded-xl border border-gray-100 hover:border-primary-100 bg-gray-50/50 hover:bg-primary-50/10 text-xs font-bold text-gray-700 hover:text-primary-800 transition-all cursor-pointer"
                          >
                            Tulis Berita
                          </button>
                          <button
                            onClick={() => { setActiveTab("events"); handleCreateInit("event"); }}
                            className="p-3 rounded-xl border border-gray-100 hover:border-primary-100 bg-gray-50/50 hover:bg-primary-50/10 text-xs font-bold text-gray-700 hover:text-primary-800 transition-all cursor-pointer"
                          >
                            Tambah Agenda
                          </button>
                          <button
                            onClick={() => { setActiveTab("gallery"); handleCreateInit("gallery"); }}
                            className="p-3 rounded-xl border border-gray-100 hover:border-primary-100 bg-gray-50/50 hover:bg-primary-50/10 text-xs font-bold text-gray-700 hover:text-primary-800 transition-all cursor-pointer"
                          >
                            Upload Foto
                          </button>
                          <button
                            onClick={() => { setActiveTab("settings"); }}
                            className="p-3 rounded-xl border border-gray-100 hover:border-primary-100 bg-gray-50/50 hover:bg-primary-50/10 text-xs font-bold text-gray-700 hover:text-primary-800 transition-all cursor-pointer"
                          >
                            Pengaturan Web
                          </button>
                        </div>
                      </div>

                      {/* Informational Widget */}
                      <div className="p-4 bg-gold-50/50 border border-gold-200 rounded-xl mt-4">
                        <p className="text-[10px] md:text-xs text-gold-900 font-medium leading-relaxed">
                          <strong>Pemberitahuan Sistem:</strong> Seluruh aktivitas pengeditan, penghapusan, dan pengunggahan berkas secara otomatis dicatat dalam menu logs kepatuhan audit keamanan.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LATEST USER MESSAGE MESSAGES */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 text-left">
                    <h3 className="font-display font-bold text-gray-900 text-sm md:text-base border-b border-gray-100 pb-3 mb-4">
                      Pesan Masuk Terbaru Form Kontak
                    </h3>
                    <div className="overflow-x-auto text-xs md:text-sm">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-left">
                            <th className="p-3">Nama</th>
                            <th className="p-3">Subjek</th>
                            <th className="p-3">Pesan</th>
                            <th className="p-3">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.slice(0, 5).map((log) => (
                            <tr key={log.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                              <td className="p-3 font-semibold text-gray-950">{log.adminName}</td>
                              <td className="p-3 text-primary-800 font-bold">{log.action}</td>
                              <td className="p-3 text-gray-600 truncate max-w-xs">{log.description}</td>
                              <td className="p-3 text-gray-400">
                                {new Date(log.createdAt).toLocaleDateString("id-ID", { hour: "numeric", minute: "numeric" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: MANAGE NEWS */}
              {activeTab === "news" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Toggle Form Editor View vs Table List */}
                  {formType === "news" ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="font-display font-extrabold text-gray-900 text-lg">
                          {isEditing ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
                        </h3>
                        <button
                          onClick={() => { setFormType(null); setEditItem(null); }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                          Tutup
                        </button>
                      </div>

                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Judul Berita *</label>
                          <input
                            type="text"
                            value={editItem.title}
                            onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                            placeholder="Contoh: Kegiatan Pondok Bulan Ini..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Kategori Berita</label>
                            <select
                              value={editItem.categoryId}
                              onChange={(e) => setEditItem({ ...editItem, categoryId: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800 bg-white"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <ImageUploader
                              label="Gambar Utama / Thumbnail Berita *"
                              value={editItem.thumbnail || ""}
                              onChange={(url) => setEditItem({ ...editItem, thumbnail: url })}
                              helpText="Upload foto dari komputer atau tempel tautan gambar."
                              aspectRatio="video"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Ringkasan Pendek (Excerpt)</label>
                          <textarea
                            rows={2}
                            value={editItem.excerpt}
                            onChange={(e) => setEditItem({ ...editItem, excerpt: e.target.value })}
                            placeholder="Ringkasan satu baris mengenai isi berita..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800 resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Isi Artikel Berita (Format HTML/Teks Lengkap) *</label>
                          <textarea
                            rows={10}
                            value={editItem.content}
                            onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                            placeholder="Tuliskan isi artikel Anda..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800 resize-y"
                            required
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white font-bold text-xs"
                          >
                            Simpan & Terbitkan
                          </button>
                          <button
                            type="button"
                            onClick={() => { setFormType(null); setEditItem(null); }}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Actions toolbar header */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-150 p-4 rounded-2xl shadow-xs">
                        <div className="relative max-w-sm w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Cari berita berdasarkan judul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-hidden"
                          />
                        </div>
                        <button
                          onClick={() => handleCreateInit("news")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Berita
                        </button>
                      </div>

                      {/* News Datatable */}
                      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto text-xs md:text-sm">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-left">
                                <th className="p-3">Judul Berita</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Penulis</th>
                                <th className="p-3">Tanggal Terbit</th>
                                <th className="p-3 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {news
                                .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((item) => (
                                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                    <td className="p-3 font-semibold text-gray-900 max-w-sm truncate">{item.title}</td>
                                    <td className="p-3">
                                      <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-800 font-bold text-[10px] uppercase">
                                        {categories.find((c) => c.id === item.categoryId)?.name || "Kabar"}
                                      </span>
                                    </td>
                                    <td className="p-3 text-gray-500">{item.authorName}</td>
                                    <td className="p-3 text-gray-400">
                                      {new Date(item.publishedAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="p-3 text-right space-x-1.5 shrink-0">
                                      <button
                                        onClick={() => handleEditInit(item, "news")}
                                        className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-800 inline-block"
                                        aria-label="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item.id, "news")}
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 inline-block"
                                        aria-label="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: MANAGE EVENTS (AGENDA) */}
              {activeTab === "events" && (
                <div className="space-y-6 animate-fade-in">
                  {formType === "event" ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6">
                      <h3 className="font-display font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">
                        {isEditing ? "Edit Agenda Kegiatan" : "Tambah Agenda Kegiatan Baru"}
                      </h3>

                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Nama Agenda Kegiatan *</label>
                          <input
                            type="text"
                            value={editItem.title}
                            onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                            placeholder="Contoh: Haflah Muwada'ah Akhir Tahun..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Waktu Mulai Agenda *</label>
                            <input
                              type="datetime-local"
                              value={editItem.startDate ? editItem.startDate.substring(0, 16) : ""}
                              onChange={(e) => setEditItem({ ...editItem, startDate: new Date(e.target.value).toISOString() })}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Lokasi Acara *</label>
                            <input
                              type="text"
                              value={editItem.location}
                              onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                              placeholder="Contoh: Serambi Masjid Utama PP Al-Ghuroba"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Deskripsi / Rincian Acara</label>
                          <textarea
                            rows={3}
                            value={editItem.description}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            placeholder="Tuliskan keterangan detail mengenai acara..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <ImageUploader
                            label="Foto / Poster Brosur Acara"
                            value={editItem.image || ""}
                            onChange={(url) => setEditItem({ ...editItem, image: url })}
                            helpText="Upload poster atau gambar kegiatan dari komputer."
                            aspectRatio="video"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                          <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-800 text-white font-bold text-xs">Simpan Agenda</button>
                          <button type="button" onClick={() => { setFormType(null); setEditItem(null); }} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs">Batal</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-end bg-white border border-gray-150 p-4 rounded-2xl shadow-xs">
                        <button
                          onClick={() => handleCreateInit("event")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Agenda
                        </button>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto text-xs md:text-sm">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-left">
                                <th className="p-3">Nama Agenda</th>
                                <th className="p-3">Lokasi</th>
                                <th className="p-3">Tanggal Kegiatan</th>
                                <th className="p-3 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {events.map((e) => (
                                <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                  <td className="p-3 font-semibold text-gray-900">{e.title}</td>
                                  <td className="p-3 text-gray-500">{e.location}</td>
                                  <td className="p-3 text-gray-400">
                                    {new Date(e.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                  </td>
                                  <td className="p-3 text-right space-x-1.5 shrink-0">
                                    <button onClick={() => handleEditInit(e, "event")} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-800 inline-block"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(e.id, "event")} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 inline-block"><Trash2 className="w-4 h-4" /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: MANAGE GALLERY */}
              {activeTab === "gallery" && (
                <div className="space-y-6 animate-fade-in">
                  {formType === "gallery" ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6">
                      <h3 className="font-display font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">Tambah Foto Galeri</h3>
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Judul Foto *</label>
                          <input type="text" value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Kategori</label>
                          <select value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Dokumentasi">Dokumentasi</option>
                            <option value="Wisuda">Wisuda</option>
                            <option value="Haflah">Haflah</option>
                            <option value="Seminar">Seminar</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <ImageUploader
                            label="Foto Galeri *"
                            value={editItem.image || ""}
                            onChange={(url) => setEditItem({ ...editItem, image: url })}
                            helpText="Upload foto dari komputer atau tempel link URL."
                            aspectRatio="video"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Deskripsi Foto</label>
                          <input type="text" value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-800 text-white font-bold text-xs">Simpan Foto</button>
                          <button type="button" onClick={() => { setFormType(null); setEditItem(null); }} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs">Batal</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-end bg-white border border-gray-150 p-4 rounded-2xl shadow-xs">
                        <button onClick={() => handleCreateInit("gallery")} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-xl text-xs font-bold cursor-pointer">
                          <Plus className="w-4 h-4" /> Upload Foto Galeri
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {galleries.map((gal) => (
                          <div key={gal.id} className="bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-xs flex flex-col justify-between group">
                            <div className="relative aspect-video">
                              <img src={gal.image} alt={gal.title} className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleDelete(gal.id, "gallery")}
                                className="absolute top-3 right-3 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-4 space-y-1">
                              <span className="text-[10px] font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-md uppercase">{gal.category}</span>
                              <h4 className="font-display font-bold text-sm text-gray-900 truncate">{gal.title}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: MANAGE BANNER */}
              {activeTab === "banner" && (
                <div className="space-y-6 animate-fade-in">
                  {formType === "banner" ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6">
                      <h3 className="font-display font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">
                        {isEditing ? "Edit Banner Slider" : "Tambah Banner Slider Baru"}
                      </h3>
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Judul Banner *</label>
                            <input type="text" value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Subjudul Banner</label>
                            <input type="text" value={editItem.subtitle} onChange={(e) => setEditItem({ ...editItem, subtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <ImageUploader
                            label="Gambar Banner Slider *"
                            value={editItem.image || ""}
                            onChange={(url) => setEditItem({ ...editItem, image: url })}
                            helpText="Disarankan rasio lanskap/banner untuk tampilan layar penuh."
                            aspectRatio="banner"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Aksi Tombol (Link & Teks)</label>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Teks Tombol" value={editItem.buttonText} onChange={(e) => setEditItem({ ...editItem, buttonText: e.target.value })} className="w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                            <input type="text" placeholder="Tautan / Link" value={editItem.buttonLink} onChange={(e) => setEditItem({ ...editItem, buttonLink: e.target.value })} className="w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-800 text-white font-bold text-xs">Simpan Banner</button>
                          <button type="button" onClick={() => { setFormType(null); setEditItem(null); }} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs">Batal</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-6 text-left">
                      <div className="flex justify-between items-center bg-white border border-gray-150 p-4 rounded-2xl shadow-xs">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-gray-500">Maksimum 5 banner slider aktif secara berkala pada Halaman Utama (BR-004).</span>
                        </div>
                        <button
                          disabled={banners.length >= 5}
                          onClick={() => handleCreateInit("banner")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Tambah Banner
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map((ban) => (
                          <div key={ban.id} className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                            <div className="aspect-video relative bg-gray-50">
                              <img src={ban.image} alt={ban.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-end text-white text-left">
                                <h4 className="font-display font-extrabold text-base md:text-lg leading-tight">{ban.title}</h4>
                                <p className="text-[10px] text-gray-300 line-clamp-1">{ban.subtitle}</p>
                              </div>
                            </div>
                            <div className="p-4 flex items-center justify-between border-t border-gray-100">
                              <span className="text-xs font-semibold text-gray-500">Urutan: #{ban.order}</span>
                              <div className="space-x-1">
                                <button onClick={() => handleEditInit(ban, "banner")} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-800 inline-block"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(ban.id, "banner")} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 inline-block"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: EDIT PAGES */}
              {activeTab === "pages" && (
                <div className="space-y-6 animate-fade-in text-left">
                  {activePageEdit ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h3 className="font-display font-bold text-gray-900 text-lg">
                          Edit Konten Halaman: {activePageEdit.title}
                        </h3>
                        <button onClick={() => setActivePageEdit(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Batal</button>
                      </div>
                      <form onSubmit={handlePageSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Isi Konten (Format Paragraf Teks) *</label>
                          <textarea
                            rows={12}
                            value={activePageEdit.content}
                            onChange={(e) => setActivePageEdit({ ...activePageEdit, content: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 resize-y"
                            required
                          />
                        </div>
                        <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-800 text-white font-bold text-xs">Simpan Perubahan Halaman</button>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4">
                      <h3 className="font-display font-bold text-gray-900 text-sm md:text-base border-b border-gray-100 pb-3 mb-2">
                        Pilih Halaman Statis yang Akan Diedit
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pages.map((p) => (
                          <div key={p.id} className="border border-gray-150 rounded-2xl p-5 hover:bg-gray-50 flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                              <h4 className="font-display font-bold text-gray-900 text-base">{p.title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2">{p.content}</p>
                            </div>
                            <button
                              onClick={() => handlePageSelect(p)}
                              className="px-4 py-2 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold cursor-pointer shrink-0"
                            >
                              Edit Konten
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 7: MANAGE ADMINS */}
              {activeTab === "admins" && admin.role === "super_admin" && (
                <div className="space-y-6 animate-fade-in text-left">
                  {formType === "admin" ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-6">
                      <h3 className="font-display font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">
                        {isEditing ? "Edit Administrator" : "Tambah Administrator Baru"}
                      </h3>
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Nama Lengkap *</label>
                            <input type="text" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Alamat Email *</label>
                            <input type="email" value={editItem.email} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <ImageUploader
                            label="Foto Profil Administrator"
                            value={editItem.photoURL || ""}
                            onChange={(url) => setEditItem({ ...editItem, photoURL: url })}
                            helpText="Upload foto profil admin dari komputer."
                            aspectRatio="square"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Hak Akses / Role *</label>
                            <select value={editItem.role} onChange={(e) => setEditItem({ ...editItem, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                              <option value="admin">Editor / Administrator</option>
                              <option value="super_admin">Super Administrator</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Status Akun</label>
                            <select value={editItem.isActive ? "true" : "false"} onChange={(e) => setEditItem({ ...editItem, isActive: e.target.value === "true" })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                              <option value="true">Aktif</option>
                              <option value="false">Nonaktif / Ditangguhkan</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-800 text-white font-bold text-xs">Simpan Admin</button>
                          <button type="button" onClick={() => { setFormType(null); setEditItem(null); }} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs">Batal</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-end bg-white border border-gray-150 p-4 rounded-2xl shadow-xs">
                        <button onClick={() => handleCreateInit("admin")} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-xl text-xs font-bold cursor-pointer">
                          <Plus className="w-4 h-4" /> Tambah Administrator
                        </button>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto text-xs md:text-sm">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-left">
                                <th className="p-3">Nama</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {admins.map((adm) => (
                                <tr key={adm.uid} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                  <td className="p-3 font-semibold text-gray-900">{adm.name}</td>
                                  <td className="p-3 text-gray-500">{adm.email}</td>
                                  <td className="p-3">
                                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[9px] uppercase ${adm.role === "super_admin" ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                                      {adm.role === "super_admin" ? "Super Admin" : "Editor"}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${adm.isActive ? "text-green-600" : "text-gray-400"}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${adm.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                                      {adm.isActive ? "Aktif" : "Nonaktif"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right space-x-1.5 shrink-0">
                                    <button onClick={() => handleEditInit(adm, "admin")} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-800 inline-block"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(adm.uid, "admin")} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 inline-block"><Trash2 className="w-4 h-4" /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 8: EDIT SETTINGS */}
              {activeTab === "settings" && settingsForm && (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6 text-left animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-display font-extrabold text-gray-900 text-lg">Pengaturan Identitas Website</h3>
                    <p className="text-xs text-gray-500">Sesuaikan data identitas resmi yang tampil pada Header, Kolom Kontak, dan Footer seluruh website.</p>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    {/* Logo & Favicon Uploaders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                      <ImageUploader
                        label="Logo Resmi Pesantren / Website *"
                        value={settingsForm.logo || ""}
                        onChange={(url) => setSettingsForm({ ...settingsForm, logo: url })}
                        helpText="Logo ini akan otomatis langsung terupdate di Navbar, Footer, Login, dan Seluruh Halaman."
                        aspectRatio="square"
                      />
                      <ImageUploader
                        label="Favicon / Ikon Tab Browser"
                        value={settingsForm.favicon || ""}
                        onChange={(url) => setSettingsForm({ ...settingsForm, favicon: url })}
                        helpText="Ikon kecil pada tab browser (opsional)."
                        aspectRatio="square"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Nama Website Resmi *</label>
                        <input type="text" value={settingsForm.siteName} onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Motto / Slogan Pesantren *</label>
                        <input type="text" value={settingsForm.slogan} onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Email Humas *</label>
                        <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Telepon / WhatsApp *</label>
                        <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Alamat Fisik Pesantren *</label>
                      <input type="text" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Tautan Facebook</label>
                        <input type="text" value={settingsForm.facebook} onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Tautan Instagram</label>
                        <input type="text" value={settingsForm.instagram} onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Tautan YouTube</label>
                        <input type="text" value={settingsForm.youtube} onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                      </div>
                    </div>

                    <button type="submit" className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary-800 hover:bg-primary-900 cursor-pointer">
                      <CheckCircle className="w-4.5 h-4.5" /> Simpan Pengaturan
                    </button>
                  </form>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 9: AUDIT LOGS */}
              {activeTab === "logs" && (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 text-left animate-fade-in">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-gray-900 text-lg">Audit Logs & Aktivitas Administrator</h3>
                    <span className="text-xs font-medium text-gray-400">Total Logs: {logs.length}</span>
                  </div>

                  <div className="overflow-x-auto text-xs md:text-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-left">
                          <th className="p-3">Waktu</th>
                          <th className="p-3">Admin</th>
                          <th className="p-3">Modul</th>
                          <th className="p-3">Operasi</th>
                          <th className="p-3">Rincian Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id} className="border-b border-gray-150 last:border-0 hover:bg-gray-50">
                            <td className="p-3 text-gray-400">
                              {new Date(log.createdAt).toLocaleString("id-ID")}
                            </td>
                            <td className="p-3 font-semibold text-gray-900">{log.adminName}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-[9px] uppercase border">
                                {log.module}
                              </span>
                            </td>
                            <td className="p-3 text-primary-800 font-bold">{log.action}</td>
                            <td className="p-3 text-gray-600 leading-normal">{log.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </main>

      </div>
    </div>
  );
};
