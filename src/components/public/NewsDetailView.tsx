import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft, Clock, BookOpen, Share2 } from "lucide-react";
import { apiService } from "../../services/api";
import { INews, ICategory } from "../../types";
import { useApp } from "../ui/AppContext";
import { SkeletonHero } from "../ui/Skeleton";

export const NewsDetailView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [item, setItem] = useState<INews | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [related, setRelated] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [detailRes, catsRes, allNewsRes] = await Promise.all([
          apiService.getNewsByIdOrSlug(slug),
          apiService.getCategories(),
          apiService.getNews({ published: true }),
        ]);

        if (detailRes.success) {
          setItem(detailRes.data);
          
          // Filter related news in same category (excluding current)
          if (allNewsRes.success) {
            const list = allNewsRes.data.filter(
              (n: any) => n.id !== detailRes.data.id && n.categoryId === detailRes.data.categoryId
            );
            // Fallback to general recent news if none in same category
            setRelated(list.length > 0 ? list.slice(0, 3) : allNewsRes.data.filter((n: any) => n.id !== detailRes.data.id).slice(0, 3));
          }
        }
        if (catsRes.success) {
          setCategories(catsRes.data);
        }
      } catch (err) {
        console.error("Failed to load news detail:", err);
        showToast("Gagal memuat isi berita.", "error");
        navigate("/berita");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Tautan berita berhasil disalin ke papan klip!", "success");
  };

  if (loading) {
    return <SkeletonHero />;
  }

  if (!item) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Berita tidak ditemukan</h2>
        <Link to="/berita" className="text-primary-800 font-semibold hover:underline">Kembali ke daftar berita</Link>
      </div>
    );
  }

  const categoryName = categories.find((c) => c.id === item.categoryId)?.name || "Kabar";

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-primary-800 transition-colors">Beranda</Link>
          <span>&gt;</span>
          <Link to="/berita" className="hover:text-primary-800 transition-colors">Berita</Link>
          <span>&gt;</span>
          <span className="text-gray-900 truncate font-semibold">{item.title}</span>
        </nav>

        {/* BACK ACTION */}
        <button
          onClick={() => navigate("/berita")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-800 hover:text-primary-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Berita
        </button>

        {/* ARTICLE HEADER */}
        <header className="space-y-4">
          <span className="inline-block px-3 py-1 bg-primary-50 border border-primary-100 text-primary-800 text-xs font-semibold rounded-lg uppercase tracking-wider">
            {categoryName}
          </span>
          <h1 className="text-2xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight tracking-tight">
            {item.title}
          </h1>

          {/* Meta Info row */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-gray-400 font-medium py-2 border-y border-gray-50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-600" />
              <span>
                {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold-600" />
              <span>Ditulis oleh: {item.authorName}</span>
            </div>
            <button
              onClick={handleShare}
              className="ml-auto inline-flex items-center gap-1.5 text-primary-800 hover:text-primary-900 font-semibold"
            >
              <Share2 className="w-4 h-4" />
              Bagikan
            </button>
          </div>
        </header>

        {/* FEATURED THUMBNAIL */}
        <div className="my-8 aspect-video rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs">
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
        </div>

        {/* ARTICLE BODY CONTENT */}
        <article className="prose md:prose-lg prose-primary max-w-none text-gray-800 leading-relaxed space-y-4">
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </article>

        {/* RELATED ARTICLES SECTION */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100 space-y-8">
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-800" />
              Berita Terkait Lainnya
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-50">
                    <img src={rel.thumbnail} alt={rel.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] text-gray-400 font-medium">
                        {new Date(rel.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <h4 className="font-display font-bold text-gray-900 text-sm leading-snug group-hover:text-primary-800 transition-colors line-clamp-2">
                        <Link to={`/berita/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                    </div>
                    <Link
                      to={`/berita/${rel.slug}`}
                      className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary-800 hover:text-primary-900 mt-2"
                    >
                      Baca Berita
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
