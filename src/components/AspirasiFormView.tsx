import React, { useState } from 'react';
import { 
  Send, 
  MessageSquareQuote, 
  CheckCircle2, 
  Copy, 
  Check, 
  Upload, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ExternalLink,
  AlertCircle,
  Camera
} from 'lucide-react';
import { KontakPenting, AspirasiLaporan } from '../types';

interface AspirasiFormViewProps {
  kontakList: KontakPenting[];
  reportHistory: AspirasiLaporan[];
  onSaveReport: (report: AspirasiLaporan) => void;
}

export const AspirasiFormView: React.FC<AspirasiFormViewProps> = ({
  kontakList,
  reportHistory,
  onSaveReport
}) => {
  const pengurusList = kontakList.filter(k => k.category === 'pengurus' || k.isPrimaryWA);
  const defaultTarget = pengurusList.find(k => k.isPrimaryWA) || pengurusList[0] || kontakList[0];

  const [selectedTargetId, setSelectedTargetId] = useState<string>(defaultTarget?.id || '');
  const [senderName, setSenderName] = useState('');
  const [houseBlock, setHouseBlock] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Infrastruktur & Selokan');
  const [message, setMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedWaUrl, setGeneratedWaUrl] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedTarget = kontakList.find(k => k.id === selectedTargetId) || defaultTarget;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    const targetPhone = selectedTarget ? (selectedTarget.whatsapp || selectedTarget.phone).replace(/\D/g, '') : '6281298765432';
    const targetName = selectedTarget ? selectedTarget.name : 'Pengurus RT 007';

    // Format clean professional Indonesian WhatsApp template
    const formattedText = `*LAPORAN & ASPIRASI WARGA RT NOLPITU 007/09*\n` +
      `Kepada Yth: ${targetName}\n` +
      `------------------------------------------\n` +
      `*Nama Pelapor:* ${senderName.trim()}\n` +
      `*Alamat/Blok:* ${houseBlock.trim() || 'Blok F Perum MBJ'}\n` +
      `*No. Kontak:* ${phone.trim() || '-'}\n` +
      `*Kategori:* ${category}\n` +
      `*Waktu Lapor:* ${new Date().toLocaleString('id-ID')}\n` +
      `------------------------------------------\n` +
      `*Isi Pesan/Laporan:*\n${message.trim()}\n` +
      `------------------------------------------\n` +
      (photoPreview ? `*(Pelapor punya foto bukti, mohon minta dikirim lewat chat ini)*\n` : '') +
      `_Mohon tindak lanjut dan konfirmasinya. Terima kasih._`;

    const encoded = encodeURIComponent(formattedText);
    const waLink = `https://wa.me/${targetPhone}?text=${encoded}`;

    const newReport: AspirasiLaporan = {
      id: 'rep-' + Date.now(),
      senderName: senderName.trim(),
      houseBlock: houseBlock.trim() || 'Blok F',
      phone: phone.trim(),
      category,
      message: message.trim(),
      photoUrl: photoPreview || undefined,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      targetContactName: targetName
    };

    onSaveReport(newReport);
    setGeneratedWaUrl(waLink);
    setGeneratedText(formattedText);
    setIsSubmitted(true);

    // Try direct open safely
    try {
      window.open(waLink, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled in modal fallback
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setMessage('');
    setPhotoPreview(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 border border-yellow-300/40 text-yellow-300 text-xs font-bold mb-3">
              <MessageSquareQuote className="w-3.5 h-3.5 text-yellow-300" />
              <span>Kanal Resmi Suara & Pelayanan Warga</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Layanan Aspirasi & Pengaduan Warga
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100 max-w-xl">
              Sampaikan keluhan fasilitas lingkungan, saran gotong royong, laporan ketertiban, atau permohonan surat ke pengurus RT NOLPITU 007/09 dengan cepat dan terpantau.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-xs space-y-1.5 max-w-xs text-left">
            <span className="font-bold text-yellow-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Terhubung Langsung WhatsApp
            </span>
            <p className="text-emerald-100 text-[11px] leading-relaxed">
              Pesan diformat otomatis dan diarahkan ke nomor HP pengurus pilihan Anda tanpa resiko salah kirim ke nomor dummy.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
          
          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Laporan Berhasil Disiapkan & Terkirim!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Pesan telah disiapkan untuk dikirim ke <strong>{selectedTarget?.name}</strong> ({selectedTarget?.phone}).
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={generatedWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
                >
                  <span>Buka WhatsApp Sekarang</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm rounded-xl transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Teks Tersalin!' : 'Salin Teks Cadangan'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-emerald-100">
                <button
                  onClick={handleResetForm}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Kirim Laporan Lainnya &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Select Destination Pengurus RT */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tujuan Pengurus RT Penerima <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {pengurusList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.roleOrOrg} ({p.phone}) {p.isPrimaryWA ? '★ Target Utama' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Nomor ini dapat diubah sewaktu-waktu di halaman "No. HP Penting & Pengurus".
                </p>
              </div>

              {/* Name & House Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nama Warga / Pelapor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Pak Budi atau Bu Sri"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Alamat Rumah / Blok <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={houseBlock}
                    onChange={(e) => setHouseBlock(e.target.value)}
                    placeholder="Contoh: Blok F3 No. 12"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    No. WhatsApp Warga (Untuk Konfirmasi Balik)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 0812xxxxxxxx"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Kategori Pengaduan / Aspirasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Infrastruktur & Selokan">Infrastruktur, Jalan & Selokan</option>
                    <option value="Keamanan & Ketertiban">Keamanan & Portal Siskamling</option>
                    <option value="Kebersihan & Sampah">Kebersihan & Jadwal Angkut Sampah</option>
                    <option value="Lampu Jalan & Penerangan">Penerangan Jalan Umum (PJU)</option>
                    <option value="Sosial & Bantuan Warga">Bantuan Sosial & Kegiatan Warga</option>
                    <option value="Administrasi & Pengantar RT">Surat Pengantar & Administrasi RT</option>
                    <option value="Ide & Masukan Lainnya">Ide / Masukan Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Detail Message */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Rincian Aspirasi / Laporan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Jelaskan detail laporan, titik lokasi spesifik di Blok F, kronologi, atau usulan perbaikan..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Upload Foto Lampiran / Bukti */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Lampiran Foto Bukti Kejadian (Opsional)
                </label>
                
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 w-48 h-32 flex items-center justify-center">
                    <img src={photoPreview} alt="Bukti" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full transition"
                      title="Hapus Lampiran"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        Unggah Foto Bukti (Selokan mampet, jalan berlubang, lampu mati, dll.)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Klik untuk memilih gambar dari HP / Komputer
                      </span>
                    </div>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan Resmi via WhatsApp ke Pengurus RT</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Sidebar Info & Recent Reports History */}
        <div className="space-y-5">
          
          {/* Guide card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Standar Pelayanan RT 007</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Laporan darurat (keamanan, medis) segera dihubungkan ke posko ronda & satpam.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Permintaan surat pengantar RT diproses dalam 1x24 jam kerja.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Privasi identitas pelapor dijamin aman dan amanah oleh pengurus RT.</span>
              </li>
            </ul>
          </div>

          {/* History of Reports */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Riwayat Laporan Dikirim ({reportHistory.length})</span>
              </h4>
            </div>

            {reportHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                Belum ada riwayat laporan yang dikirim dari browser ini.
              </p>
            ) : (
              <div className="mt-3 space-y-3 max-h-80 overflow-y-auto pr-1">
                {reportHistory.map((rep) => (
                  <div key={rep.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-emerald-800">{rep.category}</span>
                      <span>{rep.timestamp}</span>
                    </div>
                    <div className="font-semibold text-slate-800 line-clamp-1">
                      {rep.senderName} ({rep.houseBlock})
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {rep.message}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      Tujuan: {rep.targetContactName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
