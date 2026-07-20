import React, { useState } from "react";
import { Shield, Target, Award, ListCollapse, BookOpen, Users, Compass, Landmark } from "lucide-react";
import { useApp } from "../ui/AppContext";

export const ProfileView: React.FC = () => {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<"sejarah" | "visi-misi" | "logo" | "struktur">("sejarah");

  const siteName = settings?.siteName || "Pondok Pesantren Al-Ghuroba";

  // Detailed Organization Structure based on PDF Page 10-12
  const dewanPenyantun = {
    pengasuh: "Ibu Nyai Hj. Ummi Sa’adah Sa'di Habib",
    penasehat: [
      "Agus HA. Khuwaarizmiy IR Habib",
      "Agus M. Hilmi Bik Nada Habib",
      "Agus HM. Sonhaji Nawal Karim Zubaidi",
      "Agus Arif Ridlwan Akbar",
      "Ning Hj. Lia Hikmatul Maula Habib",
      "Ning Hj. Arina Maqshuratin Filkhiyam Habib",
      "Ning Amiroh",
      "Ning Qorri Ainaa"
    ]
  };

  const dewanHarian = {
    ketuaUmum: "Bpk. Nur Khamid (Cilacap)",
    ketuaSatu: "Bpk. M. Fahim Muridho (Oku Timur)",
    ketuaDua: "Ibu Washelatul O (Pemalang)",
    sekretarisUmum: "Bpk. Irhamni El M (Pamekasan)",
    sekretarisSatu: "Bpk. Nur Sholeh (Kulon Progo)",
    sekretarisDua: "Ibu Indana Zulfa (Nganjuk)",
    bendaharaUmum: "Bpk. A Taufik (Jember)",
    bendaharaSatu: "Bpk. Nur M Ulul Azmi (Nganjuk)",
    bendaharaDua: "Ibu Isyfi Syafila (Tangerang Selatan)"
  };

  const seksiSeksi = [
    {
      name: "Seksi Pendidikan dan Penerangan",
      kasiePutra: "Bpk. Wahyu Sarentat (Kasie - Banyumas)",
      kasiePutri: "Ibu Indana Zulfa (Kasie - Nganjuk)",
      anggota: ["Bpk. M. Nasrullah (Brebes)", "Bpk. Ahmad Faqih (Magelang)", "Bpk. M. Fahim Muridho (Oku Timur)", "Bpk. Nur M Ulul Azmi (Nganjuk)", "Bpk. Bahrun Niam (Trenggalek)", "Ibu Uswatul Baidho' (Rembang)", "Ibu Salsabila Firdaus (Nganjuk)", "Ibu Sri Wahyuni (Bekasi)"]
    },
    {
      name: "Seksi Keamanan dan Perweselan",
      kasiePutra: "Bpk. Bahrun Niam (Kasie - Trenggalek)",
      kasiePutri: "Ibu Faidatud Dianah (Kasie - Kulon Progo)",
      anggota: ["Bpk. Ediyanto (Purbalingga)", "Ibu Lala Alfiani (Pemalang)", "Ibu Umanah (Pekalongan)", "Ibu Washelatul O. (Pemalang)"]
    },
    {
      name: "Seksi Kesehatan",
      kasiePutra: "Bpk. Nur M Ulul Azmi (Kasie - Nganjuk)",
      kasiePutri: "Ibu Sri Wahyuni (Kasie - Bekasi)",
      anggota: ["Sdr. Shofwan (Riau)", "Ibu Washelatul O. (Pemalang)", "Ibu Umanah (Pekalongan)", "Sdri. Naila Husna A (Lampung)"]
    },
    {
      name: "Seksi Kebersihan (KBR)",
      kasiePutra: "Bpk. Nur Sa'id (Kasie - Madiun)",
      kasiePutri: "Ibu Lala Alfiani (Kasie - Pemalang)",
      anggota: ["Sdr. M. Rafi (Jember)", "Sdr. Ahmad Bahaudin (Sumsel)", "Sdr. Ata Baharudin (Tangsel)", "Ibu Salsabila Firdaus (Nganjuk)", "Sdri. Siti Aisyah (Sragen)", "Sdri. Naila Nabataz (Tuban)"]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO BANNER PROFILE */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Mengenal Lebih Dekat</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Profil Al-Ghuroba</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Membangun generasi Islam berlandaskan Al-Qur'an dan kitab salaf dengan kepatuhan tinggi kepada masyayikh.
          </p>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-150 shadow-xs">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between overflow-x-auto gap-2 py-3">
            {[
              { id: "sejarah", label: "Sejarah", icon: BookOpen },
              { id: "visi-misi", label: "Visi & Misi", icon: Target },
              { id: "logo", label: "Filosofi Logo", icon: Shield },
              { id: "struktur", label: "Struktur Organisasi", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary-800 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TAB CONTENT SECTIONS */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* A. SEJARAH */}
        {activeTab === "sejarah" && (
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-3">
                <Landmark className="w-7 h-7 text-primary-800" />
                Sejarah Singkat Pendirian
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pondok Pesantren Al-Ghuroba berdiri kokoh bermula dari sebuah visi besar dari sang pendiri, yaitu <strong>Romo KH. Ahmad Habibullah Zaini</strong>. Mengambil lokasi strategis di kelurahan Lirboyo, Kota Kediri, Jawa Timur, tempat bersejarah bagi para santri pengkaji kitab kuning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100 space-y-3">
                <span className="inline-block px-3 py-1 bg-primary-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                  Masa Rintisan Awal
                </span>
                <h3 className="font-display font-bold text-gray-900 text-lg">Merintis dari "Anak Ndalem"</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Pada awal masa rintisan, Pondok Pesantren Al-Ghuroba belum memiliki santri dari luar daerah. Kegiatan pengajaran dimulai dengan sangat sederhana di kediaman Romo KH. Ahmad Habibullah Zaini. Santri mula-mula yang mengaji hanyalah anak ndalem (keluarga dan pembantu rumah tangga) berjumlah beberapa orang saja yang diasuh secara telaten dan sabar oleh beliau.
                </p>
              </div>

              <div className="bg-gold-50/50 p-6 rounded-2xl border border-gold-200/50 space-y-3">
                <span className="inline-block px-3 py-1 bg-gold-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                  Tahun 2021
                </span>
                <h3 className="font-display font-bold text-gray-900 text-lg">Momentum Pendirian Formal</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Seiring waktu, ketulusan dan berkah keikhlasan asuhan mengundang perhatian masyarakat luar daerah. Pada tahun 2021, momentum penguatan pendirian formal pondok pesantren ini diteguhkan. Santri-santri dari luar daerah Kediri mulai berdatangan secara bertahap untuk menimba ilmu agama langsung di bawah asuhan dewan pengasuh.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              <h3 className="font-display font-bold text-gray-900 text-lg">Makna Filosofi Nama "Al-Ghuroba"</h3>
              <p>
                Nama <strong>"Al-Ghuroba"</strong> diambil dari sebuah hadits syarif masyhur yang bermakna "orang-orang asing":
              </p>
              <div className="bg-gray-50 border-l-4 border-primary-800 p-4 rounded-r-xl italic font-serif text-center py-6 text-gray-800 space-y-3">
                <p className="text-lg md:text-2xl font-semibold leading-relaxed font-arabic">
                  "بَدَأَ الْإِسْلَامُ غَرِيبًا وَسَيَعُودُ كَمَا بَدَأَ غَرِيبًا فَطُوبَى لِلْغُرَبَاءِ"
                </p>
                <p className="text-xs md:text-sm">
                  \"Islam muncul dalam keadaan asing dan akan kembali asing sebagaimana mulanya. Maka beruntunglah orang-orang yang asing (al-ghuroba’)\"
                </p>
              </div>
              <p>
                Filosofi ini mengajarkan bahwa untuk mendapatkan mutiara ilmu yang berharga, seorang santri harus berani melepaskan keterikatan emosional sementara waktu dengan rumah. Keterasingan geografis ini menempa kemandirian, kedewasaan, dan kefokusan mereka. Di pesantren Al-Ghuroba, rasa rindu rumah (home sick) diubah energinya menjadi motivasi tinggi untuk mengaji.
              </p>
            </div>
          </div>
        )}

        {/* B. VISI & MISI */}
        {activeTab === "visi-misi" && (
          <div className="space-y-12 animate-fade-in">
            {/* Motto */}
            <div className="bg-primary-900 text-white rounded-3xl p-8 md:p-10 text-center space-y-4">
              <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest block font-display">Motto Utama Pesantren</span>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-wide">
                \"Teguh dalam Agama, Mulia dalam Akhlak, Beruntung di Tengah Zaman\"
              </h3>
            </div>

            {/* Visi */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-3">
                <Compass className="w-6 h-6 text-primary-800" />
                Visi Kami
              </h2>
              <p className="text-lg md:text-xl text-primary-800 font-semibold leading-relaxed font-display bg-primary-50 p-6 rounded-2xl border border-primary-100/50">
                \"Menjadi lembaga pendidikan Islam salaf yang unggul dalam mencetak generasi ahli Al-Qur'an (Mutasyarri'), berakidah kokoh, dan berakhlakul karimah.\"
              </p>
            </div>

            {/* Misi */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary-800" />
                Misi Kami
              </h2>
              <ol className="space-y-4">
                {[
                  {
                    num: "1",
                    title: "Menyelenggarakan Pendidikan Al-Qur'an yang Berkualitas",
                    desc: "Menyelenggarakan program Tahsin (perbaikan bacaan) dan Hifzhul Qur'an (menghafal Al-Qur'an) secara intensif dengan sanad yang dapat dipertanggungjawabkan langsung."
                  },
                  {
                    num: "2",
                    title: "Memperkokoh Khazanah Keilmuan Islam Salaf",
                    desc: "Mendalami ilmu-ilmu syariat, fikih, dan bahasa Arab melalui sistem Madrasah Diniyah klasik dan kajian kitab-kitab ulama salaf."
                  },
                  {
                    num: "3",
                    title: "Membentuk Karakter Berakhlakul Karimah dan Disiplin",
                    desc: "Membina santri agar memiliki adab yang luhur, berbakti kepada orang tua dan guru, serta memiliki integritas tinggi dalam kehidupan sehari-hari."
                  },
                  {
                    num: "4",
                    title: "Menanamkan Akidah Ahlus Sunnah wal Jama'ah",
                    desc: "Membentengi santri dengan pemahaman akidah Asy'ariyah dan Maturidiyah yang lurus agar tidak mudah goyah atau terbawa arus perkembangan zaman yang negatif."
                  },
                  {
                    num: "5",
                    title: "Mewujudkan Kemandirian dan Khidmah (Pengabdian)",
                    desc: "Mendidik santri agar siap mengabdi di tengah-tengah masyarakat sebagai pelopor kebaikan dan benteng pertahanan agama Islam."
                  }
                ].map((misi, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 hover:bg-gray-50 rounded-xl transition-all">
                    <span className="w-8 h-8 rounded-lg bg-gold-custom text-gray-900 font-bold flex items-center justify-center shrink-0">
                      {misi.num}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-gray-900 text-base">{misi.title}</h4>
                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{misi.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* C. LOGO & FILOSOFI */}
        {activeTab === "logo" && (
          <div className="space-y-10 animate-fade-in">
            <h2 className="text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary-800" />
              Logo & Simbol Resmi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              {/* Desain Logo Visual Mock */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-56 h-56 rounded-3xl bg-emerald-800 border-8 border-gold-custom p-6 shadow-lg flex flex-col justify-between items-center text-white relative">
                  {/* Decorative Islamic Border */}
                  <div className="absolute inset-2 border border-white/20 rounded-2xl pointer-events-none" />
                  
                  <span className="text-xs font-bold tracking-widest text-gold-custom">AL-GHUROBA</span>
                  
                  {/* Symbol (Emblem representing dome and book) */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-8 rounded-t-full bg-gold-custom opacity-90 shadow-sm" />
                    <div className="w-16 h-10 border-x-4 border-b-4 border-white flex items-center justify-center font-bold text-lg font-serif">
                      ۩
                    </div>
                  </div>

                  <span className="text-[10px] font-medium tracking-wide uppercase text-gray-300">LIRBOYO · KEDIRI</span>
                </div>
                <span className="text-xs text-gray-400 mt-3 font-medium">Lambang Resmi Pesantren Al-Ghuroba</span>
              </div>

              {/* Penjelasan Filosofi Logo */}
              <div className="md:col-span-7 space-y-4 text-xs md:text-sm text-gray-600 leading-relaxed">
                <h3 className="font-display font-bold text-gray-900 text-lg">Makna Unsur Logo:</h3>
                <ul className="space-y-3">
                  <li>
                    <strong className="text-gray-900">Perisai Segi Lima:</strong> Melambangkan lima rukun Islam dan kesiapan membentengi diri santri dari gangguan pemikiran menyimpang luar asrama.
                  </li>
                  <li>
                    <strong className="text-gray-900">Warna Hijau & Emas:</strong> Hijau melambangkan kesuburan ilmu, kedamaian tarbiyah, dan nuansa pesantren salafiyah. Warna Emas melambangkan kemuliaan akhlakul karimah serta kejayaan mutiara dakwah.
                  </li>
                  <li>
                    <strong className="text-gray-900">Kubah & Buku Terbuka:</strong> Kubah masjid melambangkan ibadah tak terputus dan taqorrub kepada Allah SWT, sedangkan buku terbuka mewakili Kitab Suci Al-Qur'an dan khazanah kitab kuning yang dikaji tulus.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* D. STRUKTUR ORGANISASI */}
        {activeTab === "struktur" && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-3">
              <Users className="w-6 h-6 text-primary-800" />
              Susunan Pengurus Pesantren
            </h2>

            {/* Dewan Penyantun */}
            <div className="space-y-4 bg-primary-50/50 p-6 rounded-2xl border border-primary-100/50">
              <h3 className="font-display font-bold text-primary-900 text-lg border-b border-primary-200/50 pb-2">DEWAN PENYANTUN</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 text-xs font-semibold text-gray-500">PENGASUH UTAMA</div>
                <div className="md:col-span-8 font-display font-bold text-gray-900">{dewanPenyantun.pengasuh}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-primary-100/50">
                <div className="md:col-span-4 text-xs font-semibold text-gray-500">PENASEHAT / JALALATUL MASAYIKH</div>
                <div className="md:col-span-8">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm font-medium text-gray-800">
                    {dewanPenyantun.penasehat.map((pen, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-custom shrink-0" />
                        {pen}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Dewan Harian */}
            <div className="space-y-4 border border-gray-150 p-6 rounded-2xl shadow-xs">
              <h3 className="font-display font-bold text-gray-900 text-lg border-b border-gray-100 pb-2">DEWAN HARIAN</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs md:text-sm">
                <div>
                  <span className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Ketua Umum / Presidium</span>
                  <span className="block font-bold text-gray-900">{dewanHarian.ketuaUmum}</span>
                  <span className="block text-gray-500 text-xs mt-1">Ketua 1: {dewanHarian.ketuaSatu}</span>
                  <span className="block text-gray-500 text-xs">Ketua 2: {dewanHarian.ketuaDua}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Sekretaris</span>
                  <span className="block font-bold text-gray-900">{dewanHarian.sekretarisUmum}</span>
                  <span className="block text-gray-500 text-xs mt-1">Sekr 1: {dewanHarian.sekretarisSatu}</span>
                  <span className="block text-gray-500 text-xs">Sekr 2: {dewanHarian.sekretarisDua}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Bendahara</span>
                  <span className="block font-bold text-gray-900">{dewanHarian.bendaharaUmum}</span>
                  <span className="block text-gray-500 text-xs mt-1">Bend 1: {dewanHarian.bendaharaSatu}</span>
                  <span className="block text-gray-500 text-xs">Bend 2: {dewanHarian.bendaharaDua}</span>
                </div>
              </div>
            </div>

            {/* Seksi Seksi Kerja */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-gray-900 text-lg">DIVISI & DEPARTEMEN KHIDMAH</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {seksiSeksi.map((seksi, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
                    <h4 className="font-display font-bold text-primary-800 text-sm md:text-base border-b border-gray-200/50 pb-1.5">
                      {seksi.name}
                    </h4>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <p><strong className="text-gray-900">Kasie Putra:</strong> {seksi.kasiePutra}</p>
                      <p><strong className="text-gray-900">Kasie Putri:</strong> {seksi.kasiePutri}</p>
                      <div>
                        <strong className="block text-gray-900 mb-1">Anggota Tim:</strong>
                        <div className="flex flex-wrap gap-1">
                          {seksi.anggota.map((ang, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-500 text-[10px] rounded-md">
                              {ang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </section>

    </div>
  );
};
