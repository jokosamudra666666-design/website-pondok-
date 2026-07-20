import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { apiService } from "../../services/api";
import { INews, ICategory } from "../../types";
import { useApp } from "../ui/AppContext";
import { SkeletonCard } from "../ui/Skeleton";

export const NewsView: React.FC = () => {
  const { showToast } = useApp();
  const [news, setNews] = useState<INews[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Debounce search input to avoid spamming API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiService.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const params: any = { published: true };
        if (selectedCategory !== "all") {
          params.categoryId = selectedCategory;
        }
        if (debouncedSearchQuery) {
          params.search = debouncedSearchQuery;
        }

        const res = await apiService.getNews(params);
        if (res.success) {
          setNews(res.data);
          setCurrentPage(1); // Reset page on new filters
        }
      } catch (err) {
        console.error("Failed to load news:", err);
        showToast("Gagal memuat berita terbaru.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, debouncedSearchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white min-h-screen">
      
      {/* HEADER SECTION */}
      <section className="relative py-16 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Informasi Terkini</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Kabar & Berita Pesantren</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Dapatkan berita resmi, tulisan dakwah asatidz, pengumuman libur santri, serta agenda PPDB terpercaya langsung dari humas pesantren.
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full shrink-0 text-left">
              <label htmlFor="news-search" className="sr-only">Cari berita...</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="news-search"
                type="text"
                placeholder="Cari kata kunci berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-xs focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800 text-sm w-full outline-hidden"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-end w-full overflow-x-auto py-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary-800 text-white shadow-sm"
                    : "bg-white border border-gray-150 text-gray-600 hover:bg-gray-100 hover:text-primary-800"
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary-800 text-white shadow-sm"
                      : "bg-white border border-gray-150 text-gray-600 hover:bg-gray-100 hover:text-primary-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* GRID NEWS LIST */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : currentItems.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {currentItems.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-primary-800 text-white px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider">
                      {categories.find((c) => c.id === item.categoryId)?.name || "Kabar"}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-gray-900 text-base md:text-lg leading-snug group-hover:text-primary-800 transition-colors line-clamp-2">
                        <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gold-600" />
                        {item.authorName}
                      </span>
                      <Link
                        to={`/berita/${item.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary-800 group"
                      >
                        Selengkapnya
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-primary-800 text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="font-display font-bold text-gray-900 text-lg">Belum Ada Berita</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Tidak ada berita yang cocok dengan pencarian atau filter kategori yang dipilih saat ini.
            </p>
          </div>
        )}
      </section>

    </div>
  );
};
