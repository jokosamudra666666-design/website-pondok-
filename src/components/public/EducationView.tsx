import React from "react";
import { BookOpen, Award, CheckCircle, GraduationCap, Users, CalendarDays, Compass } from "lucide-react";

export const EducationView: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Sistem Pendidikan</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Kurikulum Salaf Terpadu</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Menggabungkan keaslian pembelajaran khazanah klasik dengan metodologi tahfidz intensif untuk melahirkan generasi yang mumpuni.
          </p>
        </div>
      </section>

      {/* CORE UNITS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          
          {[
            {
              title: "1. Madrasah Diniyah (MDT) Al-Ghuroba",
              icon: BookOpen,
              image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
              desc: "Kurikulum pengajaran berjenjang Madrasah Diniyah difokuskan pada penguasaan dasar-dasar syariat Islam, tata bahasa arab (Nahwu-Shorof), aqidah Ahlussunnah, fiqih ibadah mazhab Syafi'i, serta akhlakul karimah.",
              points: [
                "Metode pengajaran klasikal (Bandongan & Sorogan).",
                "Mengkaji kitab-kitab muktabar: Safinatun Najah, Jurumiyah, Imrithi, hingga Alfiyah Ibnu Malik.",
                "Ujian berstandar kelulusan berkala di setiap caturwulan."
              ]
            },
            {
              title: "2. Program Tahfidzul Qur'an Intensif",
              icon: Award,
              image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600",
              desc: "Dirancang secara khusus bagi santri putra dan putri yang berkomitmen mengkhatamkan setoran hafalan Al-Qur'an 30 Juz secara mutqin (kokoh) disertai pengasuhan sanad keilmuan yang bersambung.",
              points: [
                "Bimbingan setoran harian langsung (Sabaq, Sabqi, Manzil) bersama ustadz/ustadzah huffadz.",
                "Program karantina khusus tahfidz di waktu liburan.",
                "Sertifikasi kelulusan hafalan juz demi juz beserta sanad muttashil."
              ]
            },
            {
              title: "3. Kajian Kitab Kuning Rutin",
              icon: Compass,
              image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
              desc: "Pembelajaran orisinal teks-teks arab klasik karya para ulama salafus shalih. Kegiatan ini diampu langsung oleh dewan asatidz asuhan masyayikh Lirboyo guna menanamkan pemahaman hukum yang orisinil.",
              points: [
                "Pengajian rutin mingguan (Sorogan Kitab Fathul Qorib).",
                "Latihan memaknai teks gundul (ngabsahi) dengan makna jawa gantung / pegon secara presisi.",
                "Pendalaman aspek kaidah hukum fiqih kontemporer."
              ]
            },
            {
              title: "4. Bahtsul Masail (Scientific Forum)",
              icon: Users,
              image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
              desc: "Merupakan salah satu forum kebanggaan para santri tingkat lanjutan, di mana mereka berkumpul mendiskusikan, memperdebatkan, dan memutuskan problematika hukum Islam yang marak berkembang di masyarakat modern.",
              points: [
                "Melatih santri berpikir logis, analitis, dan memiliki argumentasi ilmiah berlandaskan dalil kitab rujukan.",
                "Delegasi resmi dikirim mengikuti forum Bahtsul Masail tingkat karesidenan.",
                "Penyusunan hasil keputusan bahtsul masail secara terdokumentasi terpusat."
              ]
            }
          ].map((unit, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              
              {/* Image Column */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-last" : ""}`}>
                <div className="relative overflow-hidden rounded-3xl aspect-video md:aspect-auto md:h-[300px] shadow-md border border-gray-100">
                  <img src={unit.image} alt={unit.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" />
                </div>
              </div>

              {/* Text Content Column */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center">
                    <unit.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-gray-900 text-xl md:text-2xl">
                    {unit.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                  {unit.desc}
                </p>
                
                <ul className="space-y-2 pt-2 text-xs md:text-sm text-gray-700">
                  {unit.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-primary-800 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* EXTRA CURRICULARS (Ekskul) */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
          <span className="text-xs font-bold text-primary-800 uppercase tracking-widest font-display">Pengembangan Bakat</span>
          <h2 className="text-3xl font-display font-extrabold text-gray-900 tracking-tight">
            Kegiatan Ekstrakurikuler Santri
          </h2>
          <p className="max-w-xl mx-auto text-sm text-gray-500">
            Kami mengimbangi pembinaan spiritual dengan pengembangan minat bakat, kreativitas, seni, serta kesehatan jasmani santri.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { title: "Seni Hadroh / Sholawat", desc: "Seni musik banjari Islami rutin berlatih setiap malam Jumat guna menumbuhkan rasa mahabbah sholawat kepada Nabi Muhammad SAW." },
            { title: "Kaligrafi Arab", desc: "Seni menulis ayat-riwayah Al-Qur'an secara estetis menggunakan kaidah Khath Tsuluts, Naskhi, dan Riq'ah." },
            { title: "Khitobah & Muhadhoroh", desc: "Pelatihan ketrampilan berpidato dalam tiga bahasa (Indonesia, Arab, Inggris) guna mempersiapkan santri menjadi dai unggul." },
            { title: "Pencak Silat Pagar Nusa", desc: "Olahraga beladiri fisik Islami NU resmi untuk memperkokoh stamina dan melatih kesiapan mental santri menghadapi bahaya fisik." }
          ].map((ekskul, index) => (
            <div key={index} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
              <span className="w-8 h-8 rounded-lg bg-gold-custom/10 text-gold-700 font-bold flex items-center justify-center text-xs mb-4">
                0{index + 1}
              </span>
              <h3 className="font-display font-bold text-gray-900 text-base mb-1.5">{ekskul.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{ekskul.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
