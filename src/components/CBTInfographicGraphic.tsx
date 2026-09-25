import React, { useState } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Download, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Eye,
  BarChart2,
  TrendingUp,
  Percent,
  Clock,
  Compass,
  Zap,
  Activity
} from 'lucide-react';
import { QuestionData, AssessmentItem, InfographicPrompt } from '../types';
import { createInfographicPrompt } from '../services/infographicPromptService';

interface CBTInfographicGraphicProps {
  question: QuestionData;
  item?: AssessmentItem;
  aspectRatio?: '16:9' | 'A4' | '1:1';
  showToolbar?: boolean;
  className?: string;
  onOpenSpecs?: () => void;
}

export const CBTInfographicGraphic: React.FC<CBTInfographicGraphicProps> = ({
  question,
  item,
  aspectRatio = '16:9',
  showToolbar = true,
  className = '',
  onOpenSpecs
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSpecModal, setShowSpecModal] = useState(false);

  // Generate or derive infographic prompt metadata
  const derivedItem: AssessmentItem = item || {
    id: question.item_id || question.id || 'TKA-01',
    no: parseInt(question.id.replace(/\D/g, '')) || 1,
    tahun: 2027,
    jenjang: 'SMP/MTs',
    fase: 'Fase D',
    mata_pelajaran: 'Matematika',
    elemen: question.elemen,
    subelemen: question.subelemen,
    kompetensi: `Penerapan literasi numerasi Fase D pada topik ${question.subelemen}`,
    indikator_prediktif: question.indikator,
    level_kognitif: question.level_kognitif,
    bentuk_soal: question.bentuk_soal,
    stimulus: question.stimulus_type,
    konteks: question.konteks,
    prioritas_prediktif: 'Prioritas Tinggi',
    skor_prediksi: 90,
    alasan: 'Indikator esensial asesmen numerasi SMP.',
    sumber_acuan: 'Kerangka Asesmen TKA SMP 2026/2027',
    status_label: 'Prediksi',
    potensi_visual: `Infografis visual kontekstual ${question.subelemen} (${question.konteks})`
  };

  const promptData: InfographicPrompt = createInfographicPrompt(derivedItem, aspectRatio);

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById(`cbt-svg-${question.id}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Infografis_${question.id}_${question.subelemen.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Render custom tailored SVG illustration matching the specific problem and prompt infografis specs
   */
  const renderVisualContent = () => {
    const qId = question.item_id || question.id;
    const sub = (question.subelemen || '').toLowerCase();
    const elem = (question.elemen || '').toLowerCase();
    const konteks = (question.konteks || '').toLowerCase();

    // 1. BILANGAN BULAT & PECAHAN (Beras UMKM / Pembagian Paket)
    if (qId.includes('BIL-01') || (elem.includes('bilangan') && (sub.includes('bulat') || sub.includes('pecahan')))) {
      return (
        <g id="visual-bilangan-pecahan">
          {/* Background card */}
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          {/* Main Title Badge */}
          <rect x="40" y="70" width="420" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            DISTRIBUSI PASOKAN BERAS UMKM "BERKAH SEJAHTERA"
          </text>

          {/* Central Stock Supply Hub */}
          <rect x="40" y="115" width="220" height="150" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" />
          <rect x="40" y="115" width="220" height="32" rx="10" fill="#E0F2FE" />
          <text x="55" y="136" fill="#0369A1" fontSize="12" fontWeight="bold" fontFamily="sans-serif">TOTAL PASOKAN AWAL</text>
          <text x="55" y="175" fill="#0F172A" fontSize="28" fontWeight="900" fontFamily="sans-serif">1 KUINTAL</text>
          <text x="55" y="200" fill="#64748B" fontSize="14" fontWeight="600" fontFamily="sans-serif">= 100 Kilogram (kg)</text>
          <text x="55" y="235" fill="#0284C7" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Beras Premium Pandan Wangi</text>

          {/* Flow Arrows */}
          <path d="M 260 160 L 320 160 L 320 145 L 350 145" fill="none" stroke="#0284C7" strokeWidth="3" markerEnd="url(#arrow-blue)" />
          <text x="270" y="140" fill="#0284C7" fontSize="11" fontWeight="bold">3/5 Bagian</text>

          <path d="M 260 210 L 320 210 L 320 280 L 350 280" fill="none" stroke="#D97706" strokeWidth="3" markerEnd="url(#arrow-amber)" />
          <text x="270" y="260" fill="#D97706" fontSize="11" fontWeight="bold">Sisa 2/5</text>

          {/* Branch 1: Kemasan 2,5 kg */}
          <rect x="360" y="105" width="400" height="110" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="370" y="115" width="90" height="90" rx="8" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1" />
          <text x="415" y="155" textAnchor="middle" fill="#0284C7" fontSize="22" fontWeight="900">2,5</text>
          <text x="415" y="175" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">KG</text>

          <text x="475" y="135" fill="#0F172A" fontSize="14" fontWeight="bold">Kemasan Kantong Rumah Tangga</text>
          <text x="475" y="155" fill="#475569" fontSize="12">Alokasi Massa: <tspan fontWeight="bold" fill="#0284C7">60 kg</tspan> (3/5 × 100 kg)</text>
          <text x="475" y="175" fill="#475569" fontSize="12">Kapasitas: <tspan fontWeight="bold" fill="#0F172A">24 Kantong</tspan> (60 kg ÷ 2,5 kg)</text>
          <rect x="475" y="185" width="160" height="22" rx="4" fill="#E0F2FE" />
          <text x="485" y="200" fill="#0369A1" fontSize="11" fontWeight="bold">Harga: Rp38.000 / kantong</text>

          {/* Branch 2: Kemasan 5 kg */}
          <rect x="360" y="230" width="400" height="110" rx="10" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
          <rect x="370" y="240" width="90" height="90" rx="8" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
          <text x="415" y="280" textAnchor="middle" fill="#D97706" fontSize="22" fontWeight="900">5,0</text>
          <text x="415" y="300" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="bold">KG</text>

          <text x="475" y="260" fill="#0F172A" fontSize="14" fontWeight="bold">Kemasan Kantong Warung Makan</text>
          <text x="475" y="280" fill="#475569" fontSize="12">Alokasi Massa: <tspan fontWeight="bold" fill="#D97706">40 kg</tspan> (Sisa 100 - 60 kg)</text>
          <text x="475" y="300" fill="#475569" fontSize="12">Kapasitas: <tspan fontWeight="bold" fill="#0F172A">8 Kantong</tspan> (40 kg ÷ 5 kg)</text>
          <rect x="475" y="310" width="160" height="22" rx="4" fill="#FEF3C7" />
          <text x="485" y="325" fill="#92400E" fontSize="11" fontWeight="bold">Harga: Rp74.000 / kantong</text>

          {/* Sales Status Legend at Bottom */}
          <rect x="40" y="350" width="720" height="35" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="60" cy="367" r="5" fill="#10B981" />
          <text x="75" y="371" fill="#334155" fontSize="12" fontWeight="bold">
            Status Terjual: Seluruh kemasan 2,5 kg (24 kantong habis) dan 6 kantong kemasan 5 kg.
          </text>
        </g>
      );
    }

    // 2. BILANGAN BERPANGKAT & BENTUK AKAR (Nanoteknologi Mikroprosesor)
    if (qId.includes('BIL-02') || (sub.includes('pangkat') || sub.includes('akar'))) {
      return (
        <g id="visual-pangkat-akar">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="460" height="30" rx="6" fill="#0284C7" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            OBSERVASI MIKROSKOP ELEKTRON: LAPISAN ISOLATOR SEMIKONDUKTOR
          </text>

          {/* Chip Cross Section Graphics */}
          <g transform="translate(40, 115)">
            {/* Base Substrate */}
            <rect x="0" y="90" width="400" height="70" fill="#1E293B" stroke="#475569" strokeWidth="1.5" rx="4" />
            <text x="15" y="130" fill="#94A3B8" fontSize="12" fontWeight="bold">Substrat Silikon Utama (Wafer Basis)</text>

            {/* Micro Oxide Layer */}
            <rect x="0" y="60" width="400" height="25" fill="#38BDF8" opacity="0.85" rx="2" />
            <text x="15" y="78" fill="#082F49" fontSize="11" fontWeight="bold">Lapisan Tipis Oksida Isolator (Dielektrik)</text>

            {/* Caliper Measurement Bracket */}
            <line x1="415" y1="60" x2="435" y2="60" stroke="#38BDF8" strokeWidth="2" />
            <line x1="415" y1="85" x2="435" y2="85" stroke="#38BDF8" strokeWidth="2" />
            <line x1="425" y1="60" x2="425" y2="85" stroke="#38BDF8" strokeWidth="2" />
            <text x="445" y="77" fill="#38BDF8" fontSize="13" fontWeight="bold">0,000000045 meter</text>
            <text x="445" y="95" fill="#94A3B8" fontSize="10">Target Notasi Ilmiah: a × 10ⁿ</text>

            {/* Dust Particle Circle */}
            <circle cx="150" cy="30" r="18" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
            <line x1="132" y1="30" x2="168" y2="30" stroke="#78350F" strokeWidth="2" strokeDasharray="3,3" />
            <text x="150" y="15" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="bold">Partikel Debu Uji</text>
            
            <line x1="175" y1="30" x2="220" y2="30" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="230" y="34" fill="#F59E0B" fontSize="13" fontWeight="bold">Diameter = √0,0009 meter</text>
          </g>

          {/* Parameter Box on Right */}
          <rect x="500" y="115" width="260" height="175" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          <text x="520" y="145" fill="#38BDF8" fontSize="13" fontWeight="bold">STANDAR LAPORAN TEKNIK</text>
          <text x="520" y="175" fill="#E2E8F0" fontSize="12">• Tebal: 0,000000045 m</text>
          <text x="520" y="195" fill="#94A3B8" fontSize="11">  (Geser 8 posisi ke kanan)</text>
          <text x="520" y="225" fill="#FDE68A" fontSize="12">• Partikel: √0,0009 m</text>
          <text x="520" y="245" fill="#94A3B8" fontSize="11">  (Bentuk akar desimal)</text>
          <text x="520" y="275" fill="#10B981" fontSize="11" fontWeight="bold">Standar Internasional IEEE</text>

          {/* Bottom scale bar */}
          <rect x="40" y="335" width="720" height="40" rx="8" fill="#1E293B" />
          <text x="60" y="360" fill="#94A3B8" fontSize="12">
            Skala Mikroskopis: 1 meter = 10⁹ nanometer (nm). Resolusi pembesaran 500.000×
          </text>
        </g>
      );
    }

    // 3. ARITMETIKA SOSIAL (Diskon Ganda Ritel vs Potongan Tunai)
    if (qId.includes('BIL-03') || (sub.includes('aritmetika') || sub.includes('diskon'))) {
      return (
        <g id="visual-diskon-ganda">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="500" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            KOMPARASI PROMOSI: PEMBELIAN TABLET EDUKASI (HARGA RESMI: Rp2.500.000,00)
          </text>

          {/* Store 1: Toko Alfa (Graha Komputer) */}
          <g transform="translate(40, 115)">
            <rect x="0" y="0" width="345" height="210" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" />
            <rect x="0" y="0" width="345" height="35" rx="10" fill="#0284C7" />
            <text x="15" y="23" fill="#FFFFFF" fontSize="13" fontWeight="bold">TOKO ALFA / GRAHA KOMPUTER</text>
            <text x="15" y="55" fill="#0369A1" fontSize="12" fontWeight="bold">Skema: Diskon Ganda Spektakuler</text>

            {/* Step 1 badge */}
            <rect x="15" y="70" width="315" height="50" rx="6" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1" />
            <text x="25" y="90" fill="#0F172A" fontSize="12" fontWeight="bold">1. Diskon Utama: 30%</text>
            <text x="25" y="108" fill="#0369A1" fontSize="11">Potongan = 30% × Rp2.500.000 = Rp750.000</text>

            {/* Step 2 badge */}
            <rect x="15" y="130" width="315" height="50" rx="6" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
            <text x="25" y="150" fill="#92400E" fontSize="12" fontWeight="bold">2. Ekstra Diskon: 10% (dari sisa)</text>
            <text x="25" y="168" fill="#B45309" fontSize="11">Dihitung dari Rp1.750.000 = Potongan Rp175.000</text>

            <text x="15" y="200" fill="#047857" fontSize="12" fontWeight="bold">Harga Akhir = Rp1.575.000,00</text>
          </g>

          {/* Store 2: Toko Beta (Prima Tekno) */}
          <g transform="translate(415, 115)">
            <rect x="0" y="0" width="345" height="210" rx="10" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" />
            <rect x="0" y="0" width="345" height="35" rx="10" fill="#D97706" />
            <text x="15" y="23" fill="#FFFFFF" fontSize="13" fontWeight="bold">TOKO BETA / PRIMA TEKNO</text>
            <text x="15" y="55" fill="#B45309" fontSize="12" fontWeight="bold">Skema: Potongan Tunai Langsung</text>

            <rect x="15" y="70" width="315" height="110" rx="6" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
            <text x="25" y="95" fill="#78350F" fontSize="13" fontWeight="bold">Voucher Tunai Langsung:</text>
            <text x="25" y="130" fill="#D97706" fontSize="24" fontWeight="900">- Rp900.000,00</text>
            <text x="25" y="155" fill="#451A03" fontSize="11">Langsung memotong harga resmi tanpa syarat</text>

            <text x="15" y="200" fill="#047857" fontSize="12" fontWeight="bold">Harga Akhir = Rp1.600.000,00</text>
          </g>

          {/* Analysis Footer */}
          <rect x="40" y="340" width="720" height="40" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <text x="55" y="365" fill="#1E40AF" fontSize="12" fontWeight="bold">
            Komparasi Numerasi: Diskon bertingkat 30% + 10% setara dengan diskon total 37% (bukan 40%).
          </text>
        </g>
      );
    }

    // 4. RASIO & PROPORSI (Jadwal Proyek Perpustakaan & Tambahan Pekerja)
    if (qId.includes('BIL-04') || (sub.includes('rasio') || sub.includes('proporsi') || sub.includes('pekerja'))) {
      return (
        <g id="visual-rasio-proyek">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="520" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            TIMELINE PROYEK PEMBANGUNAN GEDUNG PERPUSTAKAAN SEKOLAH
          </text>

          {/* Timeline Bar Graphic */}
          <g transform="translate(40, 120)">
            <text x="0" y="15" fill="#334155" fontSize="12" fontWeight="bold">Rencana Semula: 40 Hari Kerja (16 Pekerja)</text>
            
            {/* Total 40 Days bar */}
            <rect x="0" y="30" width="720" height="30" rx="6" fill="#E2E8F0" />
            <text x="360" y="50" textAnchor="middle" fill="#64748B" fontSize="12" fontWeight="bold">Total Beban Pekerjaan = 40 × 16 = 640 Hari-Orang</text>

            {/* Split Breakdown */}
            <text x="0" y="90" fill="#334155" fontSize="12" fontWeight="bold">Realisasi Lapangan Saat Pekerjaan Berjalan:</text>

            {/* Phase 1: 10 Hari Normal */}
            <rect x="0" y="105" width="180" height="45" rx="6" fill="#10B981" />
            <text x="90" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">10 Hari Kerja</text>
            <text x="90" y="142" textAnchor="middle" fill="#D1FAE5" fontSize="10">16 Orang Selesai</text>

            {/* Phase 2: 6 Hari Terhenti Cuaca */}
            <rect x="185" y="105" width="108" height="45" rx="6" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
            <text x="239" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">6 Hari Libur</text>
            <text x="239" y="142" textAnchor="middle" fill="#FEE2E2" fontSize="10">Hujan Ekstrem (0 Kerja)</text>

            {/* Phase 3: Sisa 24 Hari Efektif */}
            <rect x="298" y="105" width="422" height="45" rx="6" fill="#0284C7" />
            <text x="509" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Sisa 24 Hari Kerja Efektif</text>
            <text x="509" y="142" textAnchor="middle" fill="#E0F2FE" fontSize="10">Beban Sisa: 480 Hari-Orang (Butuh Tambahan Pekerja)</text>
          </g>

          {/* Metrics summary cards */}
          <g transform="translate(40, 290)">
            <rect x="0" y="0" width="220" height="75" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="15" y="25" fill="#64748B" fontSize="11" fontWeight="bold">BEBAN SISA</text>
            <text x="15" y="55" fill="#0F172A" fontSize="20" fontWeight="900">480 Hari-Orang</text>
            <text x="15" y="70" fill="#0284C7" fontSize="10">(30 hari tersisa × 16 pekerja)</text>

            <rect x="250" y="0" width="220" height="75" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="265" y="25" fill="#64748B" fontSize="11" fontWeight="bold">WAKTU TERSEDIA</text>
            <text x="265" y="55" fill="#0F172A" fontSize="20" fontWeight="900">24 Hari</text>
            <text x="265" y="70" fill="#EF4444" fontSize="10">(30 hari - 6 hari terhenti)</text>

            <rect x="500" y="0" width="220" height="75" rx="8" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
            <text x="515" y="25" fill="#92400E" fontSize="11" fontWeight="bold">KEBUTUHAN TOTAL</text>
            <text x="515" y="55" fill="#B45309" fontSize="20" fontWeight="900">20 Pekerja</text>
            <text x="515" y="70" fill="#78350F" fontSize="10">(480 ÷ 24 hari = 20 orang)</text>
          </g>
        </g>
      );
    }

    // 5. POLA & BARISAN BILANGAN (Panel Surya Trapesium Bertingkat)
    if (qId.includes('BIL-05') || (sub.includes('pola') || sub.includes('barisan') || sub.includes('deret'))) {
      return (
        <g id="visual-pola-panel">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="520" height="30" rx="6" fill="#0284C7" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            KONFIGURASI MODUL PLTS ATAP: POLA TRAPESIUM BERTINGKAT
          </text>

          {/* Tiered Solar Panel Layout */}
          <g transform="translate(40, 115)">
            {/* Row 1: 4 panels */}
            <text x="0" y="30" fill="#94A3B8" fontSize="12" fontWeight="bold">Baris 1 (n=1):</text>
            {[0, 1, 2, 3].map(i => (
              <rect key={i} x={110 + i * 45} y={15} width="38" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            ))}
            <text x="310" y="32" fill="#38BDF8" fontSize="12" fontWeight="bold">4 Panel</text>

            {/* Row 2: 7 panels */}
            <text x="0" y="70" fill="#94A3B8" fontSize="12" fontWeight="bold">Baris 2 (n=2):</text>
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <rect key={i} x={110 + i * 45} y={55} width="38" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            ))}
            <text x="445" y="72" fill="#38BDF8" fontSize="12" fontWeight="bold">7 Panel (+3)</text>

            {/* Row 3: 10 panels */}
            <text x="0" y="110" fill="#94A3B8" fontSize="12" fontWeight="bold">Baris 3 (n=3):</text>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <rect key={i} x={110 + i * 45} y={95} width="38" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            ))}
            <text x="580" y="112" fill="#38BDF8" fontSize="12" fontWeight="bold">10 Panel (+3)</text>

            {/* Row 4: 13 panels indicator */}
            <text x="0" y="150" fill="#94A3B8" fontSize="12" fontWeight="bold">Baris 4 (n=4):</text>
            <rect x="110" y="135" width="450" height="24" rx="4" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="330" y="152" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="bold">13 Panel Berderet (+3 Pola Konstan)</text>
            <text x="580" y="152" fill="#38BDF8" fontSize="12" fontWeight="bold">13 Panel</text>
          </g>

          {/* Energy Specifications Card */}
          <rect x="40" y="295" width="720" height="80" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          <g transform="translate(60, 310)">
            <text x="0" y="20" fill="#FDE68A" fontSize="13" fontWeight="bold">KAPASITAS DAYA LISTRIK MANDIRI</text>
            <text x="0" y="45" fill="#E2E8F0" fontSize="12">
              Daya Rata-rata per 1 Modul = <tspan fill="#38BDF8" fontWeight="bold">300 Watt-peak (Wp)</tspan>
            </text>
            <text x="380" y="20" fill="#A7F3D0" fontSize="12" fontWeight="bold">Karakteristik Barisan:</text>
            <text x="380" y="45" fill="#CBD5E1" fontSize="12">
              Suku Pertama a = 4, Beda b = 3. Pola suku ke-n: Un = 3n + 1
            </text>
          </g>
        </g>
      );
    }

    // 6. PLSV TARIF SKUTER LISTRIK
    if (qId.includes('ALJ-07') || (sub.includes('linear satu') || sub.includes('plsv'))) {
      return (
        <g id="visual-plsv-skuter">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="500" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            SKEMA TARIF SMART MOBILITY: SKUTER LISTRIK "E-RIDE CITY"
          </text>

          {/* Meter Box */}
          <g transform="translate(40, 115)">
            <rect x="0" y="0" width="345" height="155" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="0" y="0" width="345" height="32" rx="10" fill="#E0F2FE" />
            <text x="15" y="22" fill="#0369A1" fontSize="12" fontWeight="bold">KOMPONEN BIAYA APLIKASI</text>

            <circle cx="35" cy="65" r="16" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.5" />
            <text x="35" y="70" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">1</text>
            <text x="65" y="62" fill="#0F172A" fontSize="13" fontWeight="bold">Biaya Buka Kunci (Unlock Fee)</text>
            <text x="65" y="78" fill="#0284C7" fontSize="12" fontWeight="bold">Rp4.000,00 (Tetap per sewa)</text>

            <circle cx="35" cy="115" r="16" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
            <text x="35" y="120" textAnchor="middle" fill="#D97706" fontSize="11" fontWeight="bold">2</text>
            <text x="65" y="112" fill="#0F172A" fontSize="13" fontWeight="bold">Tarif Pemakaian Berjalan</text>
            <text x="65" y="128" fill="#D97706" fontSize="12" fontWeight="bold">Rp1.200,00 per menit (Variabel m)</text>
          </g>

          {/* Digital Wallet Box */}
          <g transform="translate(415, 115)">
            <rect x="0" y="0" width="345" height="155" rx="10" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
            <rect x="0" y="0" width="345" height="32" rx="10" fill="#D1FAE5" />
            <text x="15" y="22" fill="#065F46" fontSize="12" fontWeight="bold">MUTASI SALDO DOMPET DIGITAL DANANG</text>

            <text x="15" y="60" fill="#64748B" fontSize="11" fontWeight="bold">Saldo Awal Sebelum Berangkat:</text>
            <text x="15" y="85" fill="#0F172A" fontSize="22" fontWeight="900">Rp40.000,00</text>

            <text x="15" y="115" fill="#64748B" fontSize="11" fontWeight="bold">Saldo Akhir Sisa Setelah Selesai:</text>
            <text x="15" y="140" fill="#059669" fontSize="22" fontWeight="900">Rp2.400,00</text>
          </g>

          {/* Formula Line at Bottom */}
          <rect x="40" y="285" width="720" height="90" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <g transform="translate(60, 305)">
            <text x="0" y="15" fill="#1E40AF" fontSize="12" fontWeight="bold">
              Model Persamaan Linear Satu Variabel:
            </text>
            <text x="0" y="40" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="monospace">
              Biaya Total Terpakai = Rp40.000 - Rp2.400 = Rp37.600,00
            </text>
            <text x="0" y="62" fill="#1D4ED8" fontSize="13" fontFamily="monospace">
              Persamaan: 4.000 + 1.200(m) = 37.600
            </text>
          </g>
        </g>
      );
    }

    // 7. PERSAMAAN GARIS LURUS (PGL - Penurunan Suhu Gunung)
    if (qId.includes('ALJ-11') || (sub.includes('garis lurus') || sub.includes('pgl') || sub.includes('grafik'))) {
      return (
        <g id="visual-pgl-suhu">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="480" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            GRAFIK PENURUNAN SUHU UDARA TERHADAP KETINGGIAN GUNUNG
          </text>

          {/* Coordinate Plane Area */}
          <g transform="translate(60, 120)">
            {/* Axes */}
            <line x1="40" y1="200" x2="480" y2="200" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-dark)" />
            <line x1="40" y1="200" x2="40" y2="20" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-dark)" />

            <text x="490" y="205" fill="#334155" fontSize="11" fontWeight="bold">Ketinggian h (ratusan mdpl)</text>
            <text x="40" y="10" fill="#334155" fontSize="11" fontWeight="bold">Suhu T (°C)</text>

            {/* Grid markings */}
            <text x="25" y="45" fill="#64748B" fontSize="10">28°C</text>
            <line x1="36" y1="40" x2="44" y2="40" stroke="#64748B" strokeWidth="2" />

            <text x="25" y="95" fill="#64748B" fontSize="10">22°C</text>
            <line x1="36" y1="90" x2="44" y2="90" stroke="#64748B" strokeWidth="2" />

            <text x="180" y="215" fill="#64748B" fontSize="10">h = 10 (1.000 mdpl)</text>
            <line x1="180" y1="196" x2="180" y2="204" stroke="#64748B" strokeWidth="2" />

            <text x="380" y="215" fill="#64748B" fontSize="10">h = 25 (2.500 mdpl - Puncak)</text>
            <line x1="380" y1="196" x2="380" y2="204" stroke="#64748B" strokeWidth="2" />

            {/* Linear Graph Line */}
            <line x1="40" y1="40" x2="420" y2="230" stroke="#EF4444" strokeWidth="3" />

            {/* Point 1: Pos Dasar */}
            <circle cx="40" cy="40" r="6" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
            <text x="55" y="40" fill="#0284C7" fontSize="11" fontWeight="bold">Pos Dasar (0, 28°C)</text>

            {/* Point 2: Pos 2 */}
            <circle cx="180" cy="90" r="6" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
            <text x="195" y="85" fill="#0284C7" fontSize="11" fontWeight="bold">Pos 2 (10, 22°C)</text>
            <line x1="180" y1="90" x2="180" y2="200" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="90" x2="180" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />

            {/* Point 3: Puncak target */}
            <circle cx="380" cy="165" r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
            <text x="395" y="160" fill="#D97706" fontSize="11" fontWeight="bold">Puncak (h = 25)</text>
            <line x1="380" y1="165" x2="380" y2="200" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Legend and slope card on right */}
          <g transform="translate(540, 120)">
            <rect x="0" y="0" width="220" height="235" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="15" y="25" fill="#0F172A" fontSize="12" fontWeight="bold">PARAMETER GARIS PGL</text>
            <text x="15" y="55" fill="#475569" fontSize="11">Gradien m (Laju Perubahan):</text>
            <text x="15" y="75" fill="#EF4444" fontSize="13" fontWeight="bold">m = (22 - 28) ÷ (10 - 0)</text>
            <text x="15" y="95" fill="#EF4444" fontSize="14" fontWeight="bold">= -0,6 °C / ratus m</text>

            <line x1="15" y1="110" x2="205" y2="110" stroke="#E2E8F0" strokeWidth="1" />

            <text x="15" y="130" fill="#475569" fontSize="11">Persamaan Garis Lurus:</text>
            <text x="15" y="150" fill="#0A387E" fontSize="15" fontWeight="bold">T = -0,6h + 28</text>

            <line x1="15" y1="165" x2="205" y2="165" stroke="#E2E8F0" strokeWidth="1" />

            <text x="15" y="185" fill="#475569" fontSize="11">Suhu pada h = 25 (Puncak):</text>
            <text x="15" y="205" fill="#059669" fontSize="16" fontWeight="bold">T = 13 °C</text>
          </g>
        </g>
      );
    }

    // 8. TEOREMA PYTHAGORAS (Tiang Pemancar / Kuda-kuda Gazebo)
    if (elem.includes('geometri') && (sub.includes('pythagoras') || sub.includes('segitiga'))) {
      return (
        <g id="visual-pythagoras">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="520" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            STRUKTUR KASET TIANG PEMANCAR TELEKOMUNIKASI (TRIPEL PYTHAGORAS)
          </text>

          {/* Right triangle technical diagram */}
          <g transform="translate(60, 115)">
            {/* Ground Line */}
            <line x1="20" y1="210" x2="420" y2="210" stroke="#475569" strokeWidth="3" />
            <text x="430" y="215" fill="#475569" fontSize="11">Permukaan Tanah Datar</text>

            {/* Vertical Tower */}
            <rect x="95" y="15" width="10" height="195" fill="#0284C7" />
            <line x1="100" y1="15" x2="100" y2="210" stroke="#0369A1" strokeWidth="2" />
            <circle cx="100" cy="15" r="6" fill="#EF4444" />
            <text x="20" y="115" fill="#0284C7" fontSize="14" fontWeight="bold">Tinggi = 24 m</text>

            {/* Guy Wire Hypotenuse */}
            <line x1="100" y1="15" x2="310" y2="210" stroke="#D97706" strokeWidth="3" strokeDasharray="5,2" />
            <circle cx="310" cy="210" r="6" fill="#D97706" />
            
            <text x="210" y="105" fill="#B45309" fontSize="14" fontWeight="bold">
              Kawat Pancang (c = ? m)
            </text>

            {/* Right Angle Symbol */}
            <rect x="100" y="195" width="15" height="15" fill="none" stroke="#0F172A" strokeWidth="2" />
            <circle cx="107" cy="202" r="2" fill="#0F172A" />

            {/* Distance to Peg */}
            <text x="175" y="235" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="bold">
              Jarak Patok = 7 meter
            </text>
            <line x1="100" y1="220" x2="310" y2="220" stroke="#0F172A" strokeWidth="1.5" markerStart="url(#arrow-dark)" markerEnd="url(#arrow-dark)" />
          </g>

          {/* Calculation Box */}
          <g transform="translate(480, 115)">
            <rect x="0" y="0" width="280" height="240" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="0" y="0" width="280" height="32" rx="8" fill="#FEF3C7" />
            <text x="15" y="22" fill="#92400E" fontSize="12" fontWeight="bold">RUMUS TEOREMA PYTHAGORAS</text>

            <text x="15" y="55" fill="#475569" fontSize="12">Pada Segitiga Siku-siku:</text>
            <text x="15" y="80" fill="#0A387E" fontSize="16" fontWeight="bold" fontFamily="monospace">c² = a² + b²</text>
            <text x="15" y="105" fill="#0F172A" fontSize="13" fontFamily="monospace">c = √(24² + 7²)</text>
            <text x="15" y="125" fill="#0F172A" fontSize="13" fontFamily="monospace">c = √(576 + 49) = √625</text>
            <text x="15" y="150" fill="#059669" fontSize="16" fontWeight="bold">c = 25 meter per kawat</text>

            <line x1="15" y1="165" x2="265" y2="165" stroke="#E2E8F0" strokeWidth="1" />

            <text x="15" y="185" fill="#475569" fontSize="11">Total Kawat Dibutuhkan (3 Sisi):</text>
            <text x="15" y="215" fill="#0A387E" fontSize="18" fontWeight="900">3 × 25 m = 75 meter</text>
          </g>
        </g>
      );
    }

    // 9. GEOMETRI GABUNGAN (Taman Kota dan Kolam Lingkaran)
    if (elem.includes('geometri') && (sub.includes('luas') || sub.includes('keliling') || sub.includes('bangun datar') || sub.includes('lingkaran'))) {
      return (
        <g id="visual-luas-gabungan">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="520" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            DENAH ARSITEKTUR TAMAN KOTA & ZONA RUMPUT GAJAH MINI
          </text>

          {/* Architectural Blueprint */}
          <g transform="translate(60, 115)">
            {/* Rectangular Garden */}
            <rect x="0" y="0" width="380" height="200" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" rx="4" />
            <text x="190" y="30" textAnchor="middle" fill="#15803D" fontSize="13" fontWeight="bold">
              Area Lahan Rumput Hijau (Sisa Lahan)
            </text>

            {/* Semicircle Pond */}
            <path d="M 380 0 A 100 100 0 0 0 380 200 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
            <text x="320" y="105" fill="#0369A1" fontSize="12" fontWeight="bold">Kolam Ikan (d = 14 m)</text>

            {/* Dimension Indicators */}
            <line x1="0" y1="215" x2="380" y2="215" stroke="#334155" strokeWidth="1.5" />
            <text x="190" y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">Panjang = 28 meter</text>

            <line x1="-15" y1="0" x2="-15" y2="200" stroke="#334155" strokeWidth="1.5" />
            <text x="-25" y="105" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold" transform="rotate(-90, -25, 105)">Lebar = 14 meter</text>
          </g>

          {/* Budget & Area Card */}
          <g transform="translate(480, 115)">
            <rect x="0" y="0" width="280" height="240" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="0" y="0" width="280" height="32" rx="8" fill="#DCFCE7" />
            <text x="15" y="22" fill="#15803D" fontSize="12" fontWeight="bold">KALKULASI ANGGARAN RUMPUT</text>

            <text x="15" y="55" fill="#475569" fontSize="12">1. Luas Taman Total:</text>
            <text x="15" y="75" fill="#0F172A" fontSize="13" fontWeight="bold">28 m × 14 m = 392 m²</text>

            <text x="15" y="100" fill="#475569" fontSize="12">2. Luas Kolam (½ Lingkaran, r = 7 m):</text>
            <text x="15" y="120" fill="#0284C7" fontSize="13" fontWeight="bold">½ × (22/7) × 7 × 7 = 77 m²</text>

            <text x="15" y="145" fill="#475569" fontSize="12">3. Luas Lahan Ditanami Rumput:</text>
            <text x="15" y="165" fill="#15803D" fontSize="14" fontWeight="bold">392 - 77 = 315 m²</text>

            <line x1="15" y1="175" x2="265" y2="175" stroke="#E2E8F0" strokeWidth="1" />

            <text x="15" y="195" fill="#64748B" fontSize="11">Total Biaya (Rp35.000 / m²):</text>
            <text x="15" y="220" fill="#047857" fontSize="18" fontWeight="900">Rp11.025.000,00</text>
          </g>
        </g>
      );
    }

    // 10. STATISTIKA & PELUANG (Diagram Batang / Boxplot / Misleading Graph)
    if (elem.includes('data') || elem.includes('peluang') || sub.includes('statistik') || sub.includes('grafik') || sub.includes('diagram')) {
      return (
        <g id="visual-statistika-peluang">
          <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          
          <rect x="40" y="70" width="520" height="30" rx="6" fill="#0A387E" />
          <text x="55" y="90" fill="#FFFFFF" fontSize="13" fontWeight="bold">
            INFOGRAFIS DATA STATISTIK & EVALUASI PENYAJIAN VISUAL
          </text>

          {/* Bar Chart Comparison */}
          <g transform="translate(60, 120)">
            <text x="0" y="15" fill="#334155" fontSize="13" fontWeight="bold">Perbandingan Partisipasi Belajar Daring (2024 vs 2026)</text>
            
            {/* Axis */}
            <line x1="30" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="2" />
            <line x1="30" y1="180" x2="30" y2="30" stroke="#475569" strokeWidth="2" />

            {/* Truncated axis zigzag indicator */}
            <path d="M 26 150 L 34 146 L 26 142 L 34 138" fill="none" stroke="#EF4444" strokeWidth="2" />
            <text x="40" y="145" fill="#EF4444" fontSize="10" fontWeight="bold">Potongan Sumbu (Truncated)</text>

            {/* Bar 2024 */}
            <rect x="80" y="90" width="70" height="90" rx="4" fill="#0284C7" />
            <text x="115" y="80" textAnchor="middle" fill="#0284C7" fontSize="13" fontWeight="bold">78%</text>
            <text x="115" y="200" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">Tahun 2024</text>

            {/* Bar 2026 */}
            <rect x="200" y="45" width="70" height="135" rx="4" fill="#D97706" />
            <text x="235" y="35" textAnchor="middle" fill="#D97706" fontSize="13" fontWeight="bold">82%</text>
            <text x="235" y="200" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">Tahun 2026</text>
          </g>

          {/* Statistical Literacy Breakdown */}
          <g transform="translate(480, 115)">
            <rect x="0" y="0" width="280" height="240" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="0" y="0" width="280" height="32" rx="8" fill="#FEF3C7" />
            <text x="15" y="22" fill="#92400E" fontSize="12" fontWeight="bold">ANALISIS BIAS VISUAL DATA</text>

            <text x="15" y="55" fill="#475569" fontSize="12">1. Kenaikan Poin Persentase:</text>
            <text x="15" y="75" fill="#0F172A" fontSize="14" fontWeight="bold">82% - 78% = 4 Poin Persentase</text>

            <text x="15" y="105" fill="#475569" fontSize="12">2. Laju Pertumbuhan Relatif:</text>
            <text x="15" y="125" fill="#0284C7" fontSize="14" fontWeight="bold">(4 ÷ 78) × 100% ≈ 5,13%</text>

            <line x1="15" y1="145" x2="265" y2="145" stroke="#E2E8F0" strokeWidth="1" />

            <text x="15" y="165" fill="#EF4444" fontSize="11" fontWeight="bold">KESIMPULAN AUDIT:</text>
            <text x="15" y="185" fill="#334155" fontSize="11">
              Klaim pamflet "Naik &gt; 100%" adalah manipulasi visual (misleading graph).
            </text>
            <rect x="15" y="200" width="250" height="25" rx="4" fill="#FEE2E2" />
            <text x="25" y="217" fill="#991B1B" fontSize="11" fontWeight="bold">Validitas: SALAH / MENYESATKAN</text>
          </g>
        </g>
      );
    }

    // 11. UNIVERSAL CONTEXTUAL DYNAMIC GENERATOR (Fallback for any custom predicted item)
    return (
      <g id="visual-contextual-universal">
        <rect x="20" y="55" width="760" height="340" rx="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
        
        {/* Header Ribbon */}
        <rect x="40" y="70" width="560" height="32" rx="6" fill="#0A387E" />
        <text x="55" y="92" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
          INFOGRAFIS ASESMEN NUMERASI FASE D: {question.subelemen.toUpperCase()} ({question.konteks.toUpperCase()})
        </text>

        {/* Central Data Card */}
        <g transform="translate(40, 115)">
          <rect x="0" y="0" width="720" height="150" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.04))" />
          
          <rect x="0" y="0" width="720" height="32" rx="10" fill="#E0F2FE" />
          <text x="20" y="22" fill="#0369A1" fontSize="12" fontWeight="bold">
            REPRESENTASI DATA MODEL MATEMATIKA & INDIKATOR TERUKUR
          </text>

          {/* Three Metric Columns */}
          <g transform="translate(20, 50)">
            <rect x="0" y="0" width="210" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            <text x="15" y="25" fill="#64748B" fontSize="11" fontWeight="bold">ELEMEN DASAR</text>
            <text x="15" y="50" fill="#0A387E" fontSize="16" fontWeight="bold">{question.elemen}</text>
            <text x="15" y="70" fill="#0284C7" fontSize="11">{question.level_kognitif}</text>

            <rect x="235" y="0" width="210" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            <text x="250" y="25" fill="#64748B" fontSize="11" fontWeight="bold">KONTEKS TERAPAN</text>
            <text x="250" y="50" fill="#D97706" fontSize="16" fontWeight="bold">{question.konteks}</text>
            <text x="250" y="70" fill="#475569" fontSize="11">Stimulus: {question.stimulus_type}</text>

            <rect x="470" y="0" width="210" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            <text x="485" y="25" fill="#64748B" fontSize="11" fontWeight="bold">BENTUK ASESMEN</text>
            <text x="485" y="50" fill="#059669" fontSize="16" fontWeight="bold">{question.bentuk_soal}</text>
            <text x="485" y="70" fill="#10B981" fontSize="11">Fase D · SMP / MTs</text>
          </g>
        </g>

        {/* Structured Data Preview at Bottom */}
        <g transform="translate(40, 280)">
          <rect x="0" y="0" width="720" height="95" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <text x="15" y="25" fill="#334155" fontSize="12" fontWeight="bold">
            Catatan Parameter Visual Asesmen:
          </text>
          <text x="15" y="48" fill="#475569" fontSize="11" fontFamily="sans-serif">
            • Indikator: {question.indikator.slice(0, 95)}...
          </text>
          <text x="15" y="68" fill="#475569" fontSize="11" fontFamily="sans-serif">
            • Data Kontekstual: {question.stimulus_data ? question.stimulus_data.slice(0, 110) + '...' : 'Informasi numerik terverifikasi bebas petunjuk kunci.'}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className={`cbt-infographic-container relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs ${className}`}>
      {/* 1. Header Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-900 text-white border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-600 text-white">
              <BarChart2 className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-bold tracking-tight text-slate-100">
                Infografis Stimulus Asesmen
              </span>
              <span className="text-[10px] text-blue-300 hidden sm:inline">
                ({question.subelemen} · {question.konteks})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* View Specs Prompt Button */}
            <button
              type="button"
              onClick={() => setShowSpecModal(true)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700 cursor-pointer"
              title="Lihat Spesifikasi Prompt Infografis"
            >
              <Info className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Spek Prompt</span>
            </button>

            {/* Download SVG */}
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] transition-colors border border-slate-700 cursor-pointer"
              title="Unduh Gambar Infografis (SVG)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Zoom / Fullscreen modal */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
              title="Perbesar Tampilan Gambar (Zoom)"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Perbesar</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Main SVG Render Canvas */}
      <div className="relative w-full bg-slate-50 flex items-center justify-center p-2 sm:p-3 overflow-hidden select-none">
        <svg
          id={`cbt-svg-${question.id}`}
          viewBox="0 0 800 420"
          className="w-full h-auto max-h-[380px] drop-shadow-2xs rounded-lg transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
            
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284C7" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#D97706" />
            </marker>
            <marker id="arrow-dark" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
            </marker>
          </defs>

          {/* Base Background */}
          <rect width="800" height="420" rx="10" fill="url(#bg-grad)" stroke="#E2E8F0" strokeWidth="1" />

          {/* Top Brand Banner */}
          <rect x="0" y="0" width="800" height="42" fill="#0A387E" />
          <text x="25" y="26" fill="#F8FAFC" fontSize="13" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">
            CBT ANBK KEMDIKBUD · ASESMEN NUMERASI SMP/MTs FASE D
          </text>
          <rect x="660" y="10" width="115" height="22" rx="4" fill="#1E40AF" />
          <text x="717" y="25" textAnchor="middle" fill="#FEF08A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            {question.stimulus_type.toUpperCase()}
          </text>

          {/* Render Specialized Visual Content */}
          {renderVisualContent()}

          {/* Bottom Watermark Security Ribbon */}
          <rect x="0" y="402" width="800" height="18" fill="#0F172A" />
          <text x="25" y="415" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">
            Lampiran Stimulus Asesmen Resmi Kemdikbud · Bebas Petunjuk Jawaban (Safe Testing Graphic)
          </text>
          <text x="775" y="415" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">
            No. Soal: {question.id}
          </text>
        </svg>
      </div>

      {/* 3. Modal Zoom Popup */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-t-xl border-b border-slate-700">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-sm text-white">
                  Infografis Visual: {question.subelemen}
                </h3>
                <p className="text-xs text-slate-400">
                  {question.elemen} · Konteks: {question.konteks}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono font-bold text-blue-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white border-l border-slate-700 ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadSVG}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh SVG</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  setZoomLevel(1);
                }}
                className="p-2 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Tutup Pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-b-xl overflow-auto p-4 flex items-center justify-center">
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }} 
              className="transition-transform duration-150 max-w-5xl w-full"
            >
              <svg
                viewBox="0 0 800 420"
                className="w-full h-auto drop-shadow-2xl rounded-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Re-render full graphic */}
                <rect width="800" height="420" rx="10" fill="url(#bg-grad)" stroke="#E2E8F0" strokeWidth="1" />
                <rect x="0" y="0" width="800" height="42" fill="#0A387E" />
                <text x="25" y="26" fill="#F8FAFC" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  CBT ANBK KEMDIKBUD · ASESMEN NUMERASI SMP/MTs FASE D
                </text>
                <rect x="660" y="10" width="115" height="22" rx="4" fill="#1E40AF" />
                <text x="717" y="25" textAnchor="middle" fill="#FEF08A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  {question.stimulus_type.toUpperCase()}
                </text>

                {renderVisualContent()}

                <rect x="0" y="402" width="800" height="18" fill="#0F172A" />
                <text x="25" y="415" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">
                  Lampiran Stimulus Asesmen Resmi Kemdikbud · Bebas Petunjuk Jawaban (Safe Testing Graphic)
                </text>
                <text x="775" y="415" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">
                  No. Soal: {question.id}
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 4. Specs Prompt Modal (Showing link to menu 'Prompt Infografis') */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Spesifikasi Desain Infografis Soal
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sesuai Standar Menu "Generator Prompt Infografis"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 block mb-1">Judul Desain:</span>
                  <p className="font-bold text-slate-900 text-sm">{promptData.judul}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200">
                  <span className="font-bold text-blue-700 block mb-1">Rasio Aspek & Format:</span>
                  <p className="font-bold text-blue-900">Rasio {promptData.rasio} · Standar Editorial Kemdikbud</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">Tujuan Visual Stimulus:</span>
                <p className="text-slate-800 leading-relaxed">{promptData.tujuan_visual}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">Elemen & Komposisi Visual:</span>
                <p className="text-slate-800 leading-relaxed">{promptData.elemen_visual}</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Aturan Keamanan Soal (Anti-Bocoran Kunci):</span>
                </div>
                <ul className="list-disc pl-5 text-amber-950 space-y-1">
                  {promptData.larangan.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 font-mono text-[11px] text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto">
                <span className="font-bold text-slate-900 block font-sans mb-1">Prompt Lengkap AI Generator:</span>
                {promptData.full_prompt_text}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSpecModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup Spesifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
