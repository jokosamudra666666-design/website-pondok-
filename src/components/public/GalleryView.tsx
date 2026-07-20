import React, { useState, useEffect } from "react";
import { Image, X, Calendar, User, Compass, Info } from "lucide-react";
import { apiService } from "../../services/api";
import { IGallery } from "../../types";
import { useApp } from "../ui/AppContext";
import { SkeletonCard } from "../ui/Skeleton";

export const GalleryView: React.FC = () => {
  const { showToast } = useApp();
  const [galleries, setGalleries] = useState<IGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activePhoto, setActivePhoto] = useState<IGallery | null>(null);

  useEffect(() => {
    const loadGalleries = async () => {
      setLoading(true);
      try {
        const res = await apiService.getGalleries();
        if (res.success) {
          setGalleries(res.data);
        }
      } catch (err) {
        console.error("Failed to load galleries:", err);
        showToast("Gagal memuat galeri foto.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  const categories = ["all", "Kegiatan", "Dokumentasi", "Wisuda", "Haflah", "Seminar"];

  const filteredPhotos = selectedCategory === "all"
    ? galleries
    : galleries.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Galeri Dokumentasi</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Kanal Dokumentasi Visual</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Jejak langkah khidmah asuhan, kegiatan belajar mengajar santri harian, serta prosesi kelulusan haflah santri Pondok Pesantren Al-Ghuroba.
          </p>
        </div>
      </section>

      {/* FILTER PILLS */}
      <section className="py-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-primary-800 text-white shadow-sm"
                  : "bg-white border border-gray-150 text-gray-600 hover:bg-gray-100 hover:text-primary-800"
              }`}
            >
              {cat === "all" ? "Semua Foto" : cat}
            </button>
          ))}
        </div>
      </section>

      {/* PHOTO GRID GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xs border border-gray-100 cursor-pointer"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                
                {/* Overlay Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />
                
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block px-2.5 py-0.5 bg-gold-custom text-gray-900 text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                    {photo.category}
                  </span>
                  <h3 className="font-display font-bold text-sm md:text-base leading-snug">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <Image className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="font-display font-bold text-gray-900 text-lg">Galeri Foto Kosong</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Tidak ada dokumentasi foto yang sesuai dengan filter kategori yang dipilih saat ini.
            </p>
          </div>
        )}
      </section>

      {/* LIGHTBOX DETAIL DIALOG MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/90 p-4 sm:p-6 lg:p-8 animate-fade-in">
          
          {/* Close Background click trigger */}
          <div className="absolute inset-0" onClick={() => setActivePhoto(null)} />

          {/* Dialog Container */}
          <div className="relative z-10 max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button Top Right */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Column Left */}
            <div className="md:w-3/5 bg-gray-950 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-auto">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Meta Text Column Right */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between text-left overflow-y-auto">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-0.5 bg-primary-50 border border-primary-100 text-primary-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {activePhoto.category}
                </span>
                
                <h3 className="font-display font-extrabold text-gray-900 text-lg md:text-xl leading-tight">
                  {activePhoto.title}
                </h3>

                {activePhoto.description ? (
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {activePhoto.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">Tidak ada deskripsi tambahan.</p>
                )}
              </div>

              {/* Meta details list */}
              <div className="border-t border-gray-100 pt-6 mt-6 space-y-3.5 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-600" />
                  <span>
                    Diunggah:{" "}
                    {new Date(activePhoto.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gold-600" />
                  <span>Diunggah oleh: {activePhoto.uploadedBy}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
