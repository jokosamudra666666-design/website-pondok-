import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, BookOpen, Quote, Shield, Award, Users, GraduationCap, Building } from "lucide-react";
import { apiService } from "../../services/api";
import { IBanner, INews, IEvent, IGallery } from "../../types";
import { useApp } from "../ui/AppContext";
import { SkeletonHero, SkeletonCard } from "../ui/Skeleton";

export const HomeView: React.FC = () => {
  const { showToast } = useApp();
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [news, setNews] = useState<INews[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [galleries, setGalleries] = useState<IGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [bannerRes, newsRes, eventsRes, galleryRes] = await Promise.all([
          apiService.getBanners(),
          apiService.getNews({ published: true }),
          apiService.getEvents(),
          apiService.getGalleries(),
        ]);

        if (bannerRes.success) setBanners(bannerRes.data.filter((b: any) => b.isActive));
        if (newsRes.success) setNews(newsRes.data.slice(0, 3));
        if (eventsRes.success) setEvents(eventsRes.data.slice(0, 2));
        if (galleryRes.success) setGalleries(galleryRes.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load homepage data:", err);
        showToast("Gagal memuat beberapa konten halaman utama", "error");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Banner slider automatic cycle
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return (
      <div className="space-y-12">
        <SkeletonHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      
      {/* 1. HERO BANNER SLIDER */}
      <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden bg-gray-900">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              {/* Black Tint Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Banner Text Content */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-gold-500 bg-gold-500/10 border border-gold-500/20 uppercase tracking-widest animate-fade-in">
                    Pondok Pesantren Al-Ghuroba
                  </span>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-base md:text-lg text-gray-200 leading-relaxed font-sans font-light">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.buttonText && (
                    <div className="pt-2">
                      <Link
                        to={banner.buttonLink || "/"}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-700 to-green-600 hover:from-primary-800 hover:to-green-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {banner.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-3xl font-bold">Pondok Pesantren Al-Ghuroba</h1>
            <p className="mt-2 text-gray-400">Lirboyo, Kota Kediri, Jawa Timur</p>
          </div>
        )}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? "bg-gold-custom w-8" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. SAMBUTAN PENGASUH (Sambutan Ibu Nyai) */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Foto Ibu Nyai */}
            <div className="lg:col-span-4 relative group max-w-sm mx-auto">
              <div className="absolute inset-0 bg-primary-800 rounded-3xl translate-x-3 translate-y-3 z-0 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500"
                alt="Ibu Nyai Hj. Ummi Sa'adah Sa'di Habib"
                className="relative z-10 w-full h-[350px] object-cover rounded-3xl shadow-md border-4 border-white"
              />
              <div className="absolute bottom-6 right-6 z-20 bg-gold-custom text-gray-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                Pengasuh Utama
              </div>
            </div>

            {/* Content Sambutan */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-primary-800" />
                <span className="text-xs font-bold text-primary-800 uppercase tracking-widest font-display">Sambutan Pengasuh</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight">
                Membentuk Ahli Al-Qur'an Berkarakter Salafus Shalih
              </h2>
              
              <div className="relative pl-6 border-l-4 border-gold-custom py-2">
                <Quote className="absolute top-0 left-0 w-8 h-8 text-gold-500/20 -translate-x-4 -translate-y-4 rotate-180" />
                <p className="text-sm md:text-base italic text-gray-700 leading-relaxed font-serif">
                  \"Alhamdulillah, kehadiran Pondok Pesantren Al-Ghuroba di bumi Lirboyo Kediri ini diniatkan tulus untuk melestarikan tradisi keilmuan para masyayikh salaf, memelihara kalam suci Al-Qur'an di dalam dada para santri, serta memperkokoh pemahaman aqidah Ahlus Sunnah wal Jama'ah di tengah hantaman badai sekularisasi zaman.\"
                </p>
              </div>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Kami berkomitmen menciptakan lingkungan asrama (ndalem) yang kondusif, aman, dan disiplin tinggi. Santri dididik langsung dengan metode sorogan klasik, tahsin bersanad, dan dipandu moralnya berlandaskan adab yang mulia. Insya Allah, mereka akan pulang membawa ilmu yang barakah dan bermanfaat luas bagi masyarakat.
              </p>

              <div>
                <span className="block font-display font-bold text-gray-900 text-lg leading-snug">
                  Ibu Nyai Hj. Ummi Sa’adah Sa’di Habib
                </span>
                <span className="block text-xs font-semibold text-gold-700 uppercase tracking-wider">
                  Pengasuh Pondok Pesantren Al-Ghuroba
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROGRAM UNGGULAN (Core values) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-primary-800 bg-primary-50 uppercase tracking-widest">
              Lembaga Pendidikan
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 tracking-tight">
              Fokus Pendidikan Utama Kami
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Kurikulum salafiyah terpadu yang didesain secara khusus untuk melahirkan pribadi yang menguasai khazanah literatur klasik dan hafal kalamullah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              {
                icon: BookOpen,
                title: "Tahfidzul Qur'an",
                desc: "Hafalan Al-Qur'an 30 juz intensif disertai pembenahan makhroj (Tahsin) teruji dengan standard sanad yang tersambung sampai Rasulullah.",
              },
              {
                icon: Shield,
                title: "Kajian Kitab Kuning",
                desc: "Kajian mendalam terhadap teks arab gundul (Fiqih, Nahwu, Tauhid, Akhlaq) khas kurikulum Lirboyo menggunakan metode sorogan klasik.",
              },
              {
                icon: Award,
                title: "Pendidikan Akhlak",
                desc: "Pembiasaan adab kesantunan harian, kepatuhan kepada guru dan orang tua, serta tata tertib kedisiplinan asrama yang ketat.",
              },
              {
                icon: GraduationCap,
                title: "Pengembangan Dakwah",
                desc: "Pelatihan khitobah (pidato), bahtsul masail (forum bedah hukum islam), dan syiar dakwah digital santri siap guna di masyarakat.",
              },
            ].map((prog, index) => (
              <div
                key={index}
                className="group border border-gray-100 hover:border-primary-100 hover:bg-primary-50/20 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center mb-5 group-hover:bg-primary-800 group-hover:text-white transition-all duration-300">
                  <prog.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-800 transition-colors">
                  {prog.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATISTIK PESANTREN */}
      <section className="relative py-16 bg-primary-900 text-white">
        {/* Background Accent Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-800 via-primary-900 to-gray-950 opacity-90 z-0" />
        <div className="absolute inset-0 border-y border-primary-700/20 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, count: "210", label: "Santri Putra & Putri" },
              { icon: GraduationCap, count: "17", label: "Asatidzah / Pengurus" },
              { icon: Award, count: "45", label: "Alumni Terdaftar" },
              { icon: Building, count: "8", label: "Gedung / Sarana Utama" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-gold-custom/10 text-gold-500 flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="block font-display text-3xl md:text-5xl font-extrabold text-gold-custom">
                  {stat.count}
                </span>
                <span className="block text-xs md:text-sm font-medium tracking-wide text-gray-300 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BERITA TERBARU */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 text-left">
            <div>
              <span className="text-xs font-bold text-primary-800 uppercase tracking-widest font-display">Kabar Terbaru</span>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 mt-2 tracking-tight">
                Berita & Informasi Pesantren
              </h2>
            </div>
            <Link
              to="/berita"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-800 hover:text-primary-900 group"
            >
              Lihat Semua Berita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {news.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-primary-800 text-white px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider">
                    {item.categoryId === "cat-1" ? "Pengumuman" : item.categoryId === "cat-2" ? "Pendidikan" : "Kabar"}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="font-display font-bold text-gray-900 text-base md:text-lg leading-snug group-hover:text-primary-800 transition-colors line-clamp-2">
                      <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Oleh: {item.authorName}</span>
                    <Link
                      to={`/berita/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-800 group"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* 6. AGENDA KEGIATAN */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Header / Intro Agenda */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <span className="text-xs font-bold text-primary-800 uppercase tracking-widest font-display">Agenda Mendatang</span>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 tracking-tight">
                Ikuti Kegiatan & Kalender Kami
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Agenda rutin bulanan, pengajian umum wali santri, dan kalender kegiatan akademis santri Pondok Pesantren Al-Ghuroba.
              </p>
              <div className="pt-2">
                <Link
                  to="/agenda"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-800 hover:text-primary-900 group"
                >
                  Lihat Kalender Lengkap
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* List Agenda */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Date Block */}
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 shrink-0 bg-primary-50 rounded-xl flex flex-col items-center justify-center text-primary-800">
                        <span className="block text-lg font-bold leading-none">
                          {new Date(event.startDate).getDate()}
                        </span>
                        <span className="block text-[10px] font-semibold uppercase leading-none mt-1">
                          {new Date(event.startDate).toLocaleDateString("id-ID", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-gray-900 text-base leading-snug hover:text-primary-800">
                          <Link to="/agenda">{event.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-50">
                    <Link
                      to="/agenda"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-800 hover:text-primary-900"
                    >
                      Detail Acara
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. GALERI PREVIEW */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-primary-800 uppercase tracking-widest font-display">Galeri Foto</span>
            <h2 className="text-3xl font-display font-extrabold text-gray-900 tracking-tight">
              Dokumentasi Harian Pesantren
            </h2>
            <p className="text-sm text-gray-500">
              Sekilas gambaran suasana aktivitas mengaji, khidmah pengabdian, serta kebahagiaan para santri di asrama Pondok Pesantren Al-Ghuroba.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {galleries.map((gal) => (
              <div
                key={gal.id}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xs cursor-pointer"
              >
                <img
                  src={gal.image}
                  alt={gal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Black Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />
                
                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-left">
                  <span className="inline-block px-2 py-0.5 bg-gold-custom text-gray-900 text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                    {gal.category}
                  </span>
                  <h3 className="font-display font-bold text-sm md:text-base leading-snug">
                    {gal.title}
                  </h3>
                  {gal.description && (
                    <p className="text-[11px] text-gray-300 line-clamp-2 mt-1">
                      {gal.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/galeri"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl border border-primary-800/20 text-primary-800 hover:bg-primary-50 font-semibold text-sm transition-colors"
            >
              Lihat Seluruh Galeri Foto
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. DONASI & CTA PPDB */}
      <section className="py-12 bg-primary-900 text-white border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-primary-800 text-left">
            
            {/* PPDB Callout */}
            <div className="pb-10 md:pb-0 md:pr-10 space-y-4">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest font-display">Pendaftaran Online</span>
              <h3 className="text-2xl font-display font-extrabold">Penerimaan Santri Baru TA 2026/2027</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Segera daftarkan putra dan putri Anda. Kuota terbatas setiap tahun untuk menjaga rasio guru dan santri demi kualitas hafalan serta pengajaran maksimal.
              </p>
              <div className="pt-2">
                <Link
                  to="/ppdb"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-custom hover:bg-yellow-500 text-gray-900 font-bold text-sm shadow-md transition-colors"
                >
                  Informasi PPDB
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Donation Callout */}
            <div className="pt-10 md:pt-0 md:pl-10 space-y-4">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest font-display">Amal Jariyah</span>
              <h3 className="text-2xl font-display font-extrabold">Dukung Sarana Dakwah & Pendidikan</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Salurkan infaq terbaik Anda untuk pembebasan tanah perluasan asrama putri dan biaya pendidikan santri yatim-piatu dhuafa berprestasi.
              </p>
              <div className="pt-2">
                <Link
                  to="/donasi"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-sm transition-colors"
                >
                  Program Donasi
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
