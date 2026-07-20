import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, MapPin, Clock, ListCollapse, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { apiService } from "../../services/api";
import { IEvent } from "../../types";
import { useApp } from "../ui/AppContext";
import { SkeletonCard } from "../ui/Skeleton";

export const AgendaView: React.FC = () => {
  const { showToast } = useApp();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const res = await apiService.getEvents();
        if (res.success) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
        showToast("Gagal memuat agenda pesantren terbaru.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Calendar Helper Logic
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month); // Day index for Sunday = 0, Monday = 1 ...

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysArray = Array.from({ length: firstDayIndex }, (_, i) => null);
  const totalSlots = [...emptyDaysArray, ...daysArray];

  // Helper to check if a specific calendar day has an event
  const getEventsForDay = (dayNum: number) => {
    return events.filter((e) => {
      const d = new Date(e.startDate);
      return d.getDate() === dayNum && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest font-display">Kalender Kegiatan</span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Agenda Pondok Pesantren</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300">
            Jadwal kegiatan rutin bulanan, pertemuan wali santri, masa liburan asrama, serta kalender belajar Madrasah Diniyah.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDEBAR: INTERACTIVE CALENDAR WIDGET */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900 text-lg">
                  {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex items-center gap-1">
                  <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {totalSlots.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="p-2" />;
                  }

                  const dayEvents = getEventsForDay(day);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <div
                      key={`day-${day}`}
                      className={`relative p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                        hasEvents
                          ? "bg-primary-50 text-primary-800 border border-primary-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                      {hasEvents && (
                        <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-gold-custom animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3.5 h-3.5 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-custom" />
                </div>
                <span>Hari dengan agenda terjadwal</span>
              </div>
            </div>

            {/* Quick Information Note */}
            <div className="bg-primary-50/50 border border-primary-100 p-5 rounded-2xl text-left flex gap-3">
              <Info className="w-5 h-5 text-primary-800 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-primary-900 text-xs uppercase tracking-wider">Perhatian Wali Santri:</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bagi wali santri yang ingin menghadiri acara silaturahmi umum atau pengajian bulanan, mohon konfirmasi kehadiran H-3 melalui pengurus kamar masing-masing.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: EVENTS DIRECTORY LIST */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-left">
              <span className="h-0.5 w-6 bg-primary-800" />
              <h2 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wider">Daftar Agenda Terjadwal</h2>
            </div>

            {loading ? (
              <div className="space-y-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-6 text-left">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="group bg-white border border-gray-150 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 items-start"
                  >
                    
                    {/* Big Date Counter Left */}
                    <div className="w-16 h-16 shrink-0 bg-primary-800 text-white rounded-2xl flex flex-col items-center justify-center shadow-md">
                      <span className="block text-xl font-bold leading-none">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase leading-none mt-1 text-gold-500">
                        {new Date(event.startDate).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                    </div>

                    {/* Content Right */}
                    <div className="space-y-3 flex-1">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gold-custom text-gray-900 text-[10px] font-bold uppercase tracking-wider">
                          Kegiatan
                        </span>
                        <h3 className="font-display font-extrabold text-gray-900 text-lg leading-snug group-hover:text-primary-800 transition-colors">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                          <span>
                            {new Date(event.startDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                            {event.endDate && ` - Selesai`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 border border-gray-100 rounded-2xl bg-gray-50">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="font-display font-bold text-gray-900 text-lg">Tidak Ada Agenda Terjadwal</h3>
                <p className="text-xs text-gray-500">Belum ada agenda kegiatan resmi yang dijadwalkan untuk saat ini.</p>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
