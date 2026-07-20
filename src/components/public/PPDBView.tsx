import React, { useState } from "react";
import { CheckCircle, CalendarDays, DollarSign, HelpCircle, PhoneCall, ChevronDown, UserCheck, ShieldCheck, ClipboardCheck } from "lucide-react";
import { useApp } from "../ui/AppContext";

export const PPDBView: React.FC = () => {
  const { settings } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const phone = settings?.phone || "+62 815-6464-0223";

  const faqs = [
    {
      q: "Bagaimana sistem pendaftaran online santri baru Al-Ghuroba?",
      a: "Wali santri cukup mengisi formulir pada halaman PPDB di website resmi, mengunggah berkas persyaratan (Kartu Keluarga, Ijazah/Sertifikat dasar), melakukan verifikasi berkas, lalu santri dijadwalkan mengikuti tes lisan kemampuan membaca Al-Qur'an dan wawancara motivasi secara langsung atau video-call."
    },
    {
      q: "Berapa biaya bulanan (syahriyah) makan dan pemeliharaan gedung asrama?",
      a: "Pondok Pesantren Al-Ghuroba memiliki komitmen subsidi silang bagi keluarga dhuafa. Untuk tarif umum, iuran bulanan berkisar Rp 650.000,- (sudah mencakup makan 3x sehari, listrik, air, dan bimbingan asatidzah). Bagi santri yatim-piatu berprestasi dibebaskan sepenuhnya (gratis)."
    },
    {
      q: "Apakah diperbolehkan wali santri menjenguk santri di asrama?",
      a: "Wali santri diperkenankan menjenguk putra-putrinya setiap akhir bulan (Minggu ke-4) mulai pukul 08.00 s.d 17.00 WIB di ruang besuk yang disediakan pengurus keamanan asrama."
    },
    {
      q: "Bagaimana dengan kebijakan kepemilikan gawai/handphone santri?",
      a: "Untuk mendukung fokus mengaji (filosofi keterasingan yang menempa kemandirian santri), santri dilarang keras membawa gawai pribadi. Komunikasi berkala bersama orang tua difasilitasi melalui telepon kantor pengurus setiap hari Minggu bergantian."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Penerimaan Santri Baru</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">PPDB Online TA 2026/2027</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Pintu gerbang pembinaan ilmu syari'at bagi putra-putri Anda. Bergabunglah bersama kami membangun generasi masa depan yang bertakwa.
          </p>
        </div>
      </section>

      {/* REQUIREMENTS & FLOW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Alur Pendaftaran (Left Column) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-primary-800" />
              Alur Pendaftaran Santri Baru
            </h2>

            <div className="relative border-l-2 border-primary-100 pl-6 ml-4 space-y-8">
              {[
                { title: "Isi Formulir Online", desc: "Wali santri mendaftarkan data diri calon santri, data wali, serta riwayat pendidikan melalui portal online PPDB atau langsung datang ke kantor asrama Al-Ghuroba Kediri." },
                { title: "Unggah Dokumen Syarat", desc: "Unggah dokumen pendukung mencakup fotokopi KK, ijazah terakhir / rapor semester akhir, serta pasfoto formal santri ukuran 3x4." },
                { title: "Tes Seleksi Lisan", desc: "Santri mengikuti tes membaca Al-Qur'an dasar, tes hafalan surat pendek, serta tes wawancara kesiapan mental untuk tinggal mandiri di asrama." },
                { title: "Verifikasi & Pembayaran Ulang", desc: "Apabila santri dinyatakan lolos kelulusan, wali santri melakukan daftar ulang administratif, seragam, serta orientasi pengenalan asrama." }
              ].map((step, i) => (
                <div key={i} className="relative">
                  {/* Step counter button */}
                  <span className="absolute -left-10 top-0.5 w-7 h-7 rounded-full bg-primary-800 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-gray-900 text-sm md:text-base">{step.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Persyaratan Administrasi (Right Column) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-primary-50/50 p-6 rounded-3xl border border-primary-100 space-y-4">
              <h3 className="font-display font-extrabold text-primary-900 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Persyaratan Berkas
              </h3>
              <ul className="space-y-3 text-xs md:text-sm text-gray-700">
                {[
                  "Fotokopi Kartu Keluarga (KK) sebanyak 3 lembar.",
                  "Fotokopi Akta Kelahiran calon santri sebanyak 2 lembar.",
                  "Fotokopi Ijazah / SKL pendidikan terakhir 3 lembar.",
                  "Surat keterangan sehat bebas penyakit menular dari faskes.",
                  "Pasfoto formal berwarna 3x4 sebanyak 4 lembar (Putra berkopiah hitam, Putri berjilbab putih)."
                ].map((req, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-primary-800 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Contact Helpline Card */}
            <div className="bg-gold-50 p-6 rounded-3xl border border-gold-200 text-left space-y-4">
              <h3 className="font-display font-bold text-gold-900 text-base">Hubungi Panitia PPDB</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Butuh bantuan dalam melakukan pendaftaran online santri baru? Kontak narahubung panitia PPDB kami via panggilan atau WhatsApp harian.
              </p>
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Helpline WhatsApp (+62 815)
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* BIAYA & JADWAL */}
      <section className="py-16 bg-gray-50 border-y border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Jadwal Pelaksanaan */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 space-y-4">
              <h3 className="font-display font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary-800" />
                Jadwal Pendaftaran Gelombang I
              </h3>
              <div className="space-y-4 text-xs md:text-sm">
                {[
                  { range: "1 Juli - 15 Agustus 2026", label: "Pendaftaran Berkas & Tes Lisan" },
                  { range: "18 Agustus 2026", label: "Pengumuman Hasil Kelulusan Seleksi" },
                  { range: "20 Agustus - 25 Agustus 2026", label: "Daftar Ulang & Pengambilan Seragam" },
                  { range: "1 September 2026", label: "Mulai Masuk Asrama & Pengenalan Santri Baru" }
                ].map((sched, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="font-semibold text-gray-700">{sched.label}</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-800 text-xs font-bold rounded-lg shrink-0">
                      {sched.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rincian Biaya */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 space-y-4">
              <h3 className="font-display font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-800" />
                Rincian Estimasi Biaya Awal
              </h3>
              <div className="space-y-4 text-xs md:text-sm text-gray-600">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2.5">
                  <span>Pendaftaran & Seleksi Masuk</span>
                  <span className="font-bold text-gray-900">Rp 150.000,-</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2.5">
                  <span>Kitab Kuning & Buku Panduan Kamar</span>
                  <span className="font-bold text-gray-900">Rp 250.000,-</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2.5">
                  <span>Seragam Santri Putra / Putri (2 Setel)</span>
                  <span className="font-bold text-gray-900">Rp 450.000,-</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span>Syahriyah Kamar (Makan & Asrama) bulanan</span>
                  <span className="font-bold text-gray-900">Rp 650.000,-</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-primary-800" />
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Beberapa jawaban singkat mengenai kekhawatiran umum orang tua santri baru.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-150 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-gray-900 text-sm md:text-base hover:bg-gray-50 outline-hidden"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-500 leading-relaxed border-t border-gray-50 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
