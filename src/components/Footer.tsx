import React from 'react';
import { ShieldCheck, Phone, Heart, MapPin, Sparkles } from 'lucide-react';
import { KontakPenting } from '../types';

interface FooterProps {
  onNavigate: (tab: string) => void;
  kontakList: KontakPenting[];
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, kontakList }) => {
  const logoUrl = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_07.33.42_021a0e79.jpeg';
  const ketuaRT = kontakList.find(k => k.isPrimaryWA) || kontakList[0];

  return (
    <footer className="mt-16 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 border-t-4 border-yellow-400">
      
      {/* Top Banner inside Footer */}
      <div className="bg-emerald-800/60 border-b border-emerald-700/50 py-4 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-emerald-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="font-semibold">RT NOLPITU 007 / RW NOLSONGO 09</span>
            <span>• Perumahan Mutiara Bekasi Jaya Blok F</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <span>Desa Sindangmulya</span>
            <span>•</span>
            <span>Kecamatan Cibarusah</span>
            <span>•</span>
            <span>Kabupaten Bekasi</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-yellow-400 shadow-md">
                <img 
                  src={logoUrl} 
                  alt="Logo RT NOLPITU RW NOLSONGO" 
                  className="w-full h-full object-cover rounded-full bg-white" 
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  RT NOLPITU <span className="text-yellow-400">007/09</span>
                </h3>
                <p className="text-xs text-slate-400">Perumahan Mutiara Bekasi Jaya Blok F</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Portal warga resmi yang memadukan transparansi pengumuman, pengarsipan dokumentasi kegiatan gotong royong, kesiapsiagaan nomor darurat, serta penampung aspirasi demi mewujudkan lingkungan yang asri, rukun, dan amanah.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-yellow-300 font-semibold italic">
              <span>"Dari Warga, Oleh Warga, Untuk Warga"</span>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { onNavigate('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-white transition"
                >
                  Dashboard Warga
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('galeri'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-white transition"
                >
                  Upload & Galeri Kegiatan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('kontak'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-white transition"
                >
                  Edit Data No. HP Penting
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('aspirasi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-white transition"
                >
                  Form Pengaduan / Aspirasi
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">
              Sekretariat RT 007
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Blok F2 No. 07, Perum Mutiara Bekasi Jaya, Cibarusah, Jawa Barat 17340</span>
              </div>
              {ketuaRT && (
                <div className="flex items-center gap-2 text-emerald-300 pt-1">
                  <Phone className="w-4 h-4" />
                  <span>Pelayanan: {ketuaRT.phone}</span>
                </div>
              )}
              <div className="pt-2 text-[11px] text-slate-500">
                Layanan darurat 24 jam: Ambulance 119 / Polsek Cibarusah
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Pengurus RT NOLPITU 007/09 Perum MBJ Blok F. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Dikelola dengan semangat gotong royong</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};
