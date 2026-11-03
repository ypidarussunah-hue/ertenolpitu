/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GaleriUploadView } from './components/GaleriUploadView';
import { KontakPentingView } from './components/KontakPentingView';
import { AspirasiFormView } from './components/AspirasiFormView';
import { AuditView } from './components/AuditView';
import { Footer } from './components/Footer';
import { QuickEmergencyModal } from './components/QuickEmergencyModal';
import { 
  INITIAL_KONTAK, 
  INITIAL_PHOTOS, 
  INITIAL_PENGUMUMAN 
} from './data/initialData';
import { 
  PhotoKegiatan, 
  KontakPenting, 
  Pengumuman, 
  AspirasiLaporan 
} from './types';
import { CheckCircle2, Info } from 'lucide-react';

const STORAGE_KEYS = {
  PHOTOS: 'rt_nolpitu_photos_v1',
  KONTAK: 'rt_nolpitu_kontak_v1',
  PENGUMUMAN: 'rt_nolpitu_pengumuman_v1',
  REPORTS: 'rt_nolpitu_reports_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data with local persistence
  const [photos, setPhotos] = useState<PhotoKegiatan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PHOTOS;
  });

  const [kontakList, setKontakList] = useState<KontakPenting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KONTAK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_KONTAK;
  });

  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PENGUMUMAN;
  });

  const [reportHistory, setReportHistory] = useState<AspirasiLaporan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to save photos to localStorage:', e);
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KONTAK, JSON.stringify(kontakList));
    } catch (e) {
      console.error('Failed to save kontak to localStorage:', e);
    }
  }, [kontakList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(pengumumanList));
    } catch (e) {
      console.error('Failed to save pengumuman to localStorage:', e);
    }
  }, [pengumumanList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reportHistory));
    } catch (e) {
      console.error('Failed to save reports to localStorage:', e);
    }
  }, [reportHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Photo handlers
  const handleAddPhoto = (newPhotoData: Omit<PhotoKegiatan, 'id' | 'createdAt' | 'likes'>) => {
    const newPhoto: PhotoKegiatan = {
      ...newPhotoData,
      id: 'photo-' + Date.now(),
      createdAt: Date.now(),
      likes: 1
    };
    const next = [newPhoto, ...photos];
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(next));
    } catch {
      showToast('Penyimpanan penuh. Foto TIDAK tersimpan. Hapus foto lama lalu coba lagi.');
      return;
    }
    setPhotos(next);
    showToast('Foto tersimpan di perangkat ini (belum terlihat di HP warga lain).');
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
    showToast('Foto kegiatan berhasil dihapus.');
  };

  const handleLikePhoto = (id: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // Contact handlers
  const handleAddKontak = (data: Omit<KontakPenting, 'id'>) => {
    const newContact: KontakPenting = {
      ...data,
      id: 'k-' + Date.now()
    };
    // If set to primary WA, unset others
    let updated = data.isPrimaryWA 
      ? kontakList.map(k => ({ ...k, isPrimaryWA: false }))
      : [...kontakList];
    setKontakList([newContact, ...updated]);
    showToast(`Kontak "${data.name}" berhasil ditambahkan!`);
  };

  const handleEditKontak = (updatedContact: KontakPenting) => {
    let updated = kontakList.map(k => {
      if (k.id === updatedContact.id) return updatedContact;
      if (updatedContact.isPrimaryWA && k.isPrimaryWA) {
        return { ...k, isPrimaryWA: false };
      }
      return k;
    });
    setKontakList(updated);
    showToast(`Data kontak "${updatedContact.name}" berhasil diperbarui!`);
  };

  const handleDeleteKontak = (id: string) => {
    setKontakList(kontakList.filter(k => k.id !== id));
    showToast('Kontak berhasil dihapus dari direktori.');
  };

  const handleResetDefaults = () => {
    setKontakList(INITIAL_KONTAK);
    showToast('Daftar kontak berhasil dikembalikan ke default Cibarusah.');
  };

  // Announcement handler
  const handleAddPengumuman = (item: Omit<Pengumuman, 'id'>) => {
    const newPengumuman: Pengumuman = {
      ...item,
      id: 'pg-' + Date.now()
    };
    setPengumumanList([newPengumuman, ...pengumumanList]);
    showToast('Pengumuman baru berhasil diterbitkan di Dashboard!');
  };

  // Report handler
  const handleSaveReport = (report: AspirasiLaporan) => {
    setReportHistory([report, ...reportHistory]);
    showToast('Laporan berhasil disimpan ke riwayat.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 selection:bg-yellow-300 selection:text-emerald-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Logo & Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        kontakList={kontakList}
        onOpenQuickEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            photos={photos}
            kontakList={kontakList}
            pengumumanList={pengumumanList}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenUploadModal={() => {
              setActiveTab('galeri');
              setIsUploadModalOpen(true);
            }}
            onAddPengumuman={handleAddPengumuman}
            onPhotoClick={() => setActiveTab('galeri')}
          />
        )}

        {activeTab === 'galeri' && (
          <GaleriUploadView
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onLikePhoto={handleLikePhoto}
            isUploadModalOpen={isUploadModalOpen}
            setIsUploadModalOpen={setIsUploadModalOpen}
          />
        )}

        {activeTab === 'kontak' && (
          <KontakPentingView
            kontakList={kontakList}
            onAddKontak={handleAddKontak}
            onEditKontak={handleEditKontak}
            onDeleteKontak={handleDeleteKontak}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {activeTab === 'aspirasi' && (
          <AspirasiFormView
            kontakList={kontakList}
            reportHistory={reportHistory}
            onSaveReport={handleSaveReport}
          />
        )}

        {activeTab === 'audit' && (
          <AuditView
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        kontakList={kontakList}
      />

      {/* Emergency Modal */}
      <QuickEmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        kontakList={kontakList}
      />

    </div>
  );
}
