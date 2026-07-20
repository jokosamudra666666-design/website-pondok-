import React, { useState, useEffect } from "react";
import { Landmark, ArrowRight, CheckCircle, Info, QrCode, X, HeartHandshake } from "lucide-react";
import { apiService } from "../../services/api";
import { IDonation } from "../../types";
import { useApp } from "../ui/AppContext";
import { SkeletonCard } from "../ui/Skeleton";

export const DonationView: React.FC = () => {
  const { showToast } = useApp();
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQris, setActiveQris] = useState<string | null>(null);

  useEffect(() => {
    const loadDonations = async () => {
      setLoading(true);
      try {
        const res = await apiService.getDonations();
        if (res.success) {
          setDonations(res.data.filter((d: any) => d.isActive));
        }
      } catch (err) {
        console.error("Failed to load donations:", err);
        showToast("Gagal memuat daftar program donasi.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const handleCopy = (accNum: string) => {
    navigator.clipboard.writeText(accNum.replace(/\s+/g, ""));
    showToast("Nomor rekening berhasil disalin ke papan klip!", "success");
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Infaq & Shodaqoh</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Investasi Akhirat Jariyah</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Dukung peningkatan kualitas fasilitas belajar mengajar dan asrama bagi para penghafal Al-Qur'an di Pondok Pesantren Al-Ghuroba.
          </p>
        </div>
      </section>

      {/* DONATION CAMPAIGNS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Active Programs (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2.5">
              <HeartHandshake className="w-7 h-7 text-primary-800" />
              Program Wakaf & Infaq Terbuka
            </h2>

            {loading ? (
              <div className="space-y-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : donations.length > 0 ? (
              <div className="space-y-8">
                {donations.map((don) => (
                  <div
                    key={don.id}
                    className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start"
                  >
                    
                    {/* Bank Info Box */}
                    <div className="w-full md:w-52 shrink-0 bg-primary-50/50 border border-primary-100/50 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-primary-800" />
                        <span className="font-display font-bold text-gray-900 text-sm leading-none">{don.bank}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">No. Rekening</span>
                        <span className="block font-mono font-bold text-primary-800 text-sm md:text-base tracking-wide">
                          {don.accountNumber}
                        </span>
                        <span className="block text-[10px] text-gray-500 font-semibold">{don.accountName}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(don.accountNumber)}
                          className="flex-1 py-1.5 rounded-lg border border-primary-800/20 text-[10px] font-bold text-primary-800 hover:bg-primary-50 transition-colors"
                        >
                          Salin No. Rek
                        </button>
                        {don.qris && (
                          <button
                            onClick={() => setActiveQris(don.qris || null)}
                            className="p-1.5 rounded-lg bg-primary-800 text-white hover:bg-primary-900 transition-colors"
                            aria-label="Tampilkan QRIS"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Campaign Text Content */}
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="inline-block px-2.5 py-0.5 bg-gold-custom text-gray-900 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          Kebutuhan Dana Jariyah
                        </span>
                        <h3 className="font-display font-extrabold text-gray-900 text-base md:text-lg">
                          {don.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                          {don.description}
                        </p>
                      </div>

                      {/* Assurance Row */}
                      <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] md:text-xs text-gray-400 font-semibold uppercase tracking-wide">
                        <CheckCircle className="w-4.5 h-4.5 text-green-600" />
                        <span>Kepercayaan amanah & transparan</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Belum ada rincian program donasi saat ini.</p>
            )}
          </div>

          {/* Quick Guidance Box (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary-50/40 p-6 rounded-3xl border border-primary-100 space-y-4">
              <h3 className="font-display font-extrabold text-primary-900 text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-800" />
                Konfirmasi Transfer
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Selepas melakukan pengiriman dana infaq atau shodaqoh melalui transfer bank atau scan QRIS, harap berkenan mengirimkan foto struk / resi transfer kepada Panitia Keuangan Yayasan Al-Ghuroba.
              </p>
              <div className="bg-white rounded-xl p-3 border border-primary-100/50 text-[11px] text-gray-500 space-y-1">
                <p>Format Konfirmasi:</p>
                <p className="font-bold font-mono text-gray-900">Nama_InfaqUntuk_JumlahNominal</p>
                <p className="font-semibold">Kirim WhatsApp: +62 815-6464-0223</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* QRIS LIGHTBOX ZOOME OVERLAY */}
      {activeQris && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/85 p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setActiveQris(null)} />
          
          <div className="relative z-10 max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <button
              onClick={() => setActiveQris(null)}
              className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
              aria-label="Tutup QRIS"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-gray-900 text-base pt-2">Scan QRIS Amal Jariyah</h3>
            
            {/* Mock QRIS Visual Frame */}
            <div className="mx-auto w-64 h-64 border-4 border-primary-800 rounded-2xl overflow-hidden p-2 bg-white flex items-center justify-center shadow-inner relative">
              <img src={activeQris} alt="QRIS Code" className="w-full h-full object-contain" />
              {/* Scan target visual overlay pointer */}
              <div className="absolute inset-4 border border-gold-custom opacity-50 rounded-xl" />
            </div>

            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Scan barcode QRIS di atas melalui dompet digital Anda (Gopay, OVO, ShopeePay, Dana, LinkAja, atau Mobile Banking).
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
