import React, { useState } from 'react';
import { 
  Home, 
  Image as ImageIcon, 
  PhoneCall, 
  MessageSquareQuote, 
  CheckCircle2, 
  Menu, 
  X, 
  ShieldAlert, 
  Sparkles,
  Phone
} from 'lucide-react';
import { KontakPenting } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  kontakList: KontakPenting[];
  onOpenQuickEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  kontakList,
  onOpenQuickEmergency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_07.33.42_021a0e79.jpeg';

  const navItems: { id: string; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'galeri', label: 'Galeri Foto Kegiatan', icon: ImageIcon },
    { id: 'kontak', label: 'No. HP Penting & Pengurus', icon: PhoneCall },
    { id: 'aspirasi', label: 'Aspirasi & Laporan', icon: MessageSquareQuote },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary RT Chairman Contact
  const ketuaRT = kontakList.find(k => k.isPrimaryWA || k.name.toLowerCase().includes('ketua')) || kontakList[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      {/* Top micro bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white text-xs px-4 py-1.5 font-medium shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <span>Portal Resmi Warga RT NOLPITU (007/09) Perumahan Mutiara Bekasi Jaya Blok F</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-100">
            <span className="hidden sm:inline">Kecamatan Cibarusah, Kab. Bekasi</span>
            <span className="hidden md:inline">•</span>
            {ketuaRT && (
              <a 
                href={`https://wa.me/${ketuaRT.whatsapp?.replace(/\D/g, '') || ketuaRT.phone.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold text-yellow-300"
              >
                <Phone className="w-3 h-3" />
                Layanan RT: {ketuaRT.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header with Logo & Brand */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo and Brand Title */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group select-none"
          >
            <div className="relative">
              {/* Golden circular frame highlight matching the emblem */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 shadow-md group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={logoUrl} 
                  alt="Logo RT NOLPITU RW NOLSONGO Perum MBJ Blok F" 
                  className="w-full h-full object-cover rounded-full bg-white border border-yellow-200"
                  onError={(e) => {
                    // Fallback visual if path fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-emerald-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                007/09
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors">
                  RT NOLPITU <span className="text-amber-500 font-black">007/09</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  RW NOLSONGO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-1">
                Perumahan Mutiara Bekasi Jaya • Blok F, Cibarusah
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-emerald-700 font-semibold italic">
                <span>"Dari Warga, Oleh Warga, Untuk Warga"</span>
              </div>
            </div>
          </div>

          {/* Quick Emergency Button & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenQuickEmergency}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-sm hover:shadow transition active:scale-95 border border-red-500"
              title="Panggilan Kontak Darurat Cibarusah"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>Kontak Darurat</span>
              <span className="hidden md:inline text-[11px] bg-red-800/80 px-1.5 py-0.5 rounded-full font-mono">112/119</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition border border-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center justify-between mt-3 pt-2 border-t border-emerald-100/70">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-300' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? 'bg-yellow-400 text-emerald-950' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 bg-yellow-50 text-amber-800 px-2.5 py-1 rounded-full border border-yellow-200 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sistem Segar Hijau-Kuning
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-300' : 'text-emerald-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive ? 'bg-yellow-400 text-emerald-950' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Perumahan MBJ Blok F, Cibarusah</span>
            <span className="font-bold text-emerald-700">RT 007 / RW 09</span>
          </div>
        </div>
      )}
    </header>
  );
};
