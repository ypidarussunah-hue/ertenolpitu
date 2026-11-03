import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  User, 
  Trash2, 
  Heart, 
  Eye, 
  Download, 
  X, 
  Plus, 
  Sparkles,
  Camera,
  CheckCircle,
  Tag,
  Share2,
  FileText
} from 'lucide-react';
import { PhotoKegiatan, CategoryKegiatan } from '../types';

interface GaleriUploadViewProps {
  photos: PhotoKegiatan[];
  onAddPhoto: (newPhoto: Omit<PhotoKegiatan, 'id' | 'createdAt' | 'likes'>) => void;
  onDeletePhoto: (id: string) => void;
  onLikePhoto: (id: string) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
}

const CATEGORIES: CategoryKegiatan[] = [
  'Semua',
  'Kerja Bakti',
  'Keamanan & Ronda',
  'Kesehatan & Posyandu',
  'Sosial & Keagamaan',
  'HUT RI & Lomba',
  'Rapat Warga',
  'Lain-lain'
];

const compressImage = (file: File, maxSide = 1280, quality = 0.72): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new Error('canvas'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')); };
    img.src = url;
  });

export const GaleriUploadView: React.FC<GaleriUploadViewProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onLikePhoto,
  isUploadModalOpen,
  setIsUploadModalOpen
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKegiatan>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhoto, setActivePhoto] = useState<PhotoKegiatan | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<PhotoKegiatan | null>(null);
  
  // Upload form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryKegiatan>('Kerja Bakti');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Lingkungan Blok F, Perum MBJ');
  const [description, setDescription] = useState('');
  const [uploaderName, setUploaderName] = useState('Warga / Pengurus RT 007');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered photos
  const filteredPhotos = photos.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Mohon pilih file gambar yang valid (JPEG, PNG, WebP).');
      return;
    }

    // Limit to reasonable size ~10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 10MB.');
      return;
    }

    compressImage(file).then(setImagePreview).catch(() => setUploadError('Foto tidak bisa dibaca, coba foto lain.'));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Mohon pilih file gambar yang valid.');
      return;
    }
    compressImage(file).then(setImagePreview).catch(() => setUploadError('Foto tidak bisa dibaca, coba foto lain.'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setUploadError('Silakan pilih atau unggah foto terlebih dahulu.');
      return;
    }
    if (!title.trim()) {
      setUploadError('Judul kegiatan wajib diisi.');
      return;
    }

    onAddPhoto({
      title: title.trim(),
      date: date || new Date().toISOString().split('T')[0],
      category,
      location: location.trim() || 'Lingkungan Blok F',
      description: description.trim() || 'Dokumentasi kegiatan warga RT NOLPITU 007/09 Perumahan MBJ Blok F.',
      imageUrl: imagePreview,
      uploaderName: uploaderName.trim() || 'Warga RT 007'
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImagePreview(null);
    setUploadError(null);
    setIsUploadModalOpen(false);
  };

  const handleDownload = (photo: PhotoKegiatan) => {
    const a = document.createElement('a');
    a.href = photo.imageUrl;
    a.download = `kegiatan-rt07-${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = (photo: PhotoKegiatan) => {
    navigator.clipboard.writeText(`${photo.title} (${photo.date}) - Lokasi: ${photo.location}. Dokumentasi RT NOLPITU 007/09 Perum MBJ Blok F.`);
    setCopiedId(photo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner Galeri */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 border border-yellow-300/40 text-yellow-300 text-xs font-bold mb-3">
              <Camera className="w-3.5 h-3.5 text-yellow-300" />
              <span>Dokumentasi Resmi & Arsip Lingkungan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Galeri Kegiatan Warga RT NOLPITU
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100 max-w-xl">
              Abadikan momen gotong royong kerja bakti, pos ronda malam, posyandu melati, perayaan 17 Agustus, dan musyawarah warga Perum MBJ Blok F.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-emerald-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5 active:scale-95 text-sm"
          >
            <UploadCloud className="w-5 h-5 text-emerald-950" />
            <span>Upload Foto Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Category & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan, tanggal, lokasi..."
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-emerald-700">{filteredPhotos.length}</span> dari {photos.length} dokumentasi
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'Semua' 
              ? photos.length 
              : photos.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50/60 text-slate-700 hover:bg-emerald-100/70 border border-emerald-100'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-yellow-400 text-emerald-950' : 'bg-white text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Photo Cards */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Belum ada foto pada kategori ini</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Jadilah yang pertama mengunggah dokumentasi kegiatan warga RT NOLPITU 007/09!
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Foto Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Header / Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-900/85 backdrop-blur-xs text-yellow-300 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-yellow-300/40 shadow-xs">
                      {photo.category}
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setActivePhoto(photo)}
                      className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-yellow-400 hover:text-emerald-950 transition transform hover:scale-110 shadow-md"
                      title="Lihat Detail & Perbesar"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(photo)}
                      className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-emerald-600 hover:text-white transition transform hover:scale-110 shadow-md"
                      title="Unduh Foto"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPhotoToDelete(photo)}
                      className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition transform hover:scale-110 shadow-md"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {photo.date}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {photo.location}
                    </span>
                  </div>

                  <h3 
                    onClick={() => setActivePhoto(photo)}
                    className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1 hover:text-emerald-700 cursor-pointer transition"
                  >
                    {photo.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[120px] font-medium">{photo.uploaderName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(photo)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    title="Salin Keterangan Foto"
                  >
                    {copiedId === photo.id ? (
                      <span className="text-[10px] font-bold text-emerald-700">Tersalin!</span>
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onLikePhoto(photo.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 transition font-semibold text-[11px]"
                    title="Apresiasi Kegiatan Warga"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{photo.likes}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL UPLOAD FOTO ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setIsUploadModalOpen(false);
                setUploadError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Foto Kegiatan Warga</h3>
                <p className="text-xs text-slate-500">RT NOLPITU 007/09 Perumahan Mutiara Bekasi Jaya Blok F</p>
              </div>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <span className="font-bold">Perhatian:</span> {uploadError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Drag and drop / file selector box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih / Tarik Foto Kegiatan <span className="text-red-500">*</span>
                </label>
                
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 aspect-video flex items-center justify-center group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 text-white rounded-full transition"
                      title="Ganti Foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded">
                      Foto Siap Disimpan
                    </span>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-2xl p-6 text-center cursor-pointer transition"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      Klik untuk memilih foto dari galeri HP / Komputer
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Mendukung format JPG, PNG, WEBP (Maksimal 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama / Judul Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kerja Bakti Selokan Blok F"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryKegiatan)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'Semua').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Depan Pos Ronda / Lapangan Blok F"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Singkat Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan ringkasan kegiatan, partisipasi warga, atau hasil kegiatan..."
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Uploader Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pengunggah / Nama Warga</label>
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Contoh: Pak Budi (Blok F2/10) atau Seksi Kebersihan"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition"
                >
                  Simpan & Publikasikan Foto
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= LIGHTBOX PREVIEW MODAL ================= */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/80 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-emerald-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {activePhoto.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base truncate max-w-md">
                  {activePhoto.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activePhoto)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title="Unduh Foto Resolusi Penuh"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-2 overflow-hidden min-h-[300px] max-h-[60vh]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {activePhoto.date}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <MapPin className="w-3.5 h-3.5" />
                    {activePhoto.location}
                  </span>
                </div>
                <div>
                  Diunggah oleh: <strong className="text-slate-200">{activePhoto.uploaderName}</strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activePhoto.description}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ================= CONFIRM DELETE MODAL ================= */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-rose-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Hapus Dokumentasi Foto?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apakah Anda yakin ingin menghapus foto kegiatan <br />
              <strong className="text-slate-700">"{photoToDelete.title}"</strong>?
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeletePhoto(photoToDelete.id);
                  setPhotoToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Ya, Hapus Foto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
