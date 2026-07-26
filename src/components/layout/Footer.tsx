import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Heart } from "lucide-react";
import { useApp } from "../ui/AppContext";
// @ts-ignore
import logoImg from "../../assets/images/al_ghuroba_logo_1784517143166.jpg";

export const Footer: React.FC = () => {
  const { settings } = useApp();

  const siteName = settings?.siteName || "Pondok Pesantren Al-Ghuroba";
  const email = settings?.email || "pondokpesantrenalghuroba@gmail.com";
  const phone = settings?.phone || "+62 815-6464-0223";
  const address = settings?.address || "Jl. Kyai Abdul Karim RT 01 RW 01, Lirboyo, Kediri";

  return (
    <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 text-slate-300 pt-16 pb-8 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={settings?.logo || logoImg} 
                alt={settings?.siteName || "Logo Al-Ghuroba"} 
                className="w-10 h-10 object-contain" 
                referrerPolicy="no-referrer" 
              />
              <div>
                <span className="block font-display font-bold text-white leading-tight tracking-tight">
                  Al-Ghuroba
                </span>
                <span className="block text-[10px] font-medium text-amber-400 tracking-wider uppercase">
                  Lirboyo, Kediri
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Lembaga Pendidikan Islam Salaf Terpadu berkomitmen mencetak generasi ahli Al-Qur'an (Mutasyarri'), berakidah kokoh, berakhlakul karimah, dan berkhidmah untuk agama, bangsa, dan negara.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Kolom 2: Menu Cepat */}
          <div>
            <h3 className="text-white font-display font-semibold text-base mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gold-custom">
              Menu Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-500 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-gold-500 transition-colors">Profil Pesantren</Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-gold-500 transition-colors">Berita & Informasi</Link>
              </li>
              <li>
                <Link to="/agenda" className="hover:text-gold-500 transition-colors">Agenda Kegiatan</Link>
              </li>
              <li>
                <Link to="/ppdb" className="hover:text-gold-500 transition-colors">Penerimaan Santri Baru (PPDB)</Link>
              </li>
              <li>
                <Link to="/donasi" className="hover:text-gold-500 transition-colors">Program Donasi</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Program Pendidikan */}
          <div>
            <h3 className="text-white font-display font-semibold text-base mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gold-custom">
              Pendidikan
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>Madrasah Diniyah (MDT)</li>
              <li>Tahfidzul Qur'an (30 Juz)</li>
              <li>Kajian Kitab Kuning</li>
              <li>Bahtsul Masail & Khidmah</li>
              <li>Kajian Keagamaan & Sholawat</li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami */}
          <div>
            <h3 className="text-white font-display font-semibold text-base mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gold-custom">
              Kontak & Alamat
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-xs leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-gold-500 text-xs transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold-500 text-xs transition-colors">{email}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {siteName}. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan khidmah & cinta <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk santri Al-Ghuroba.
          </p>
        </div>
      </div>
    </footer>
  );
};
