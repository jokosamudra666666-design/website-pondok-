import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, Landmark } from "lucide-react";
import { apiService } from "../../services/api";
import { useApp } from "../ui/AppContext";

export const ContactView: React.FC = () => {
  const { settings, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubLoading] = useState(false);

  const email = settings?.email || "pondokpesantrenalghuroba@gmail.com";
  const phone = settings?.phone || "+62 815-6464-0223";
  const address = settings?.address || "Jl. Kyai Abdul Karim RT 01 RW 01, Kelurahan Lirboyo, Kecamatan Mojoroto, Kota Kediri, Jawa Timur";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast("Harap isi seluruh formulir pesan sebelum mengirim.", "warning");
      return;
    }

    setSubLoading(true);
    try {
      const res = await apiService.submitContact(formData);
      if (res.success) {
        showToast(res.message, "success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err: any) {
      showToast(err.message || "Gagal mengirim pesan. Silakan coba kembali.", "error");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Hubungi Kami</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Kanal Komunikasi Resmi</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Ada pertanyaan seputar asrama, pendaftaran santri baru, kurikulum, atau kunjungan? Silakan tinggalkan pesan Anda di bawah.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER CONTENT */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact details & Map (Left Column) */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Landmark className="w-6 h-6 text-primary-800" />
              Sekretariat & Alamat
            </h2>

            <div className="space-y-6 text-xs md:text-sm text-gray-600">
              <div className="flex gap-3.5 items-start p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <MapPin className="w-5.5 h-5.5 text-primary-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-gray-900 font-display">Pondok Pesantren Al-Ghuroba</strong>
                  <p className="leading-relaxed text-xs">{address}</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <Phone className="w-5 h-5 text-primary-800 shrink-0" />
                <div className="space-y-0.5">
                  <strong className="block text-gray-900 font-display">WhatsApp / Telepon</strong>
                  <a href={`tel:${phone}`} className="hover:text-primary-800 transition-colors block">{phone}</a>
                </div>
              </div>

              <div className="flex gap-3.5 items-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <Mail className="w-5 h-5 text-primary-800 shrink-0" />
                <div className="space-y-0.5">
                  <strong className="block text-gray-900 font-display">Email Humas</strong>
                  <a href={`mailto:${email}`} className="hover:text-primary-800 transition-colors block">{email}</a>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps Box */}
            <div className="w-full h-64 rounded-3xl overflow-hidden border border-gray-150 shadow-xs relative">
              <iframe
                title="Pondok Pesantren Al-Ghuroba Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.7937510757757!2d112.000412!3d-7.811654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e5f2a1a0f90d%3A0xe6bf44b41b1812aa!2sLirboyo%2C%20Mojoroto%2C%20Kediri%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Form Message (Right Column) */}
          <div className="lg:col-span-7 bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-display font-extrabold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary-800" />
                Tinggalkan Pesan Anda
              </h2>
              <p className="text-xs text-gray-500">
                Layanan komunikasi harian. Admin kami akan menanggapi balasan Anda melalui alamat email yang disertakan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="text-xs font-bold text-gray-700">Nama Lengkap</label>
                  <input
                    id="form-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Muhammad Akhyar"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="text-xs font-bold text-gray-700">Alamat Email</label>
                  <input
                    id="form-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Contoh: akhyar@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="form-subject" className="text-xs font-bold text-gray-700">Subjek Pesan</label>
                <input
                  id="form-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Contoh: Tanya Pendaftaran Santri"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="form-message" className="text-xs font-bold text-gray-700">Isi Pesan / Pertanyaan</label>
                <textarea
                  id="form-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pertanyaan detail Anda di sini secara sopan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-hidden focus:ring-2 focus:ring-primary-800/10 focus:border-primary-800 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Sedang Mengirim..." : "Kirim Pesan Sekarang"}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};
