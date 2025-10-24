import { Injectable } from "@angular/core";
import { Bidang } from "./bidang";
import { BidangDirektorat, BidangDirektoratLabel } from "./bidang-direktorat";
import { Sektor } from "./sektor";

@Injectable({ providedIn: 'root' })
export class BidangDirektoratSektorService {
    
    getBidangDirektori() {
        const bidang: Bidang[] = [
            { namaBidang: BidangDirektorat[BidangDirektorat.IPOLHANKAM], deskripsiBidang: BidangDirektoratLabel.get(BidangDirektorat.IPOLHANKAM) },
            { namaBidang: BidangDirektorat[BidangDirektorat.SOSBUDMAS], deskripsiBidang: BidangDirektoratLabel.get(BidangDirektorat.SOSBUDMAS) },
            { namaBidang: BidangDirektorat[BidangDirektorat.EKOKEU], deskripsiBidang: BidangDirektoratLabel.get(BidangDirektorat.EKOKEU) },
            { namaBidang: BidangDirektorat[BidangDirektorat.PAMSTRA], deskripsiBidang: BidangDirektoratLabel.get(BidangDirektorat.PAMSTRA) },
            { namaBidang: BidangDirektorat[BidangDirektorat.TIPRODIN], deskripsiBidang: BidangDirektoratLabel.get(BidangDirektorat.TIPRODIN) }     
        ];
        return bidang;
    }

    getSektor() {
        const sektor: Sektor[] = [
            // Ideologi, Politik, Pertahanan dan Keamanan
            { namaSektor: 'PENGAMANAN_PANCASILA', deskripsiSektor: 'Pengamanan Pancasila', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'KESATUAN_PERSATUAN_BANGSA', deskripsiSektor: 'Kesatuan dan Persatuan Bangsa', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'GERAKAN_SEPARATIS', deskripsiSektor: 'Gerakan Separatis', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'PENYELENGGARAAN_PEMERINTAHAN', deskripsiSektor: 'Penyelenggaraan Pemerintahan', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            // { namaSektor: 'PARPOL', deskripsiSektor: 'Partai Politik', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'PARPOL_PEMILU_PILKADA', deskripsiSektor: 'Partai Politik, Pemilu dan Pilkada', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'GERAKAN_TERORIS_RADIKAL', deskripsiSektor: 'Gerakan Teroris dan Radikalisme', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'PENGAWASAN_WILAYAH_TERITORIAL', deskripsiSektor: 'Pengawasan wilayah Teritorial', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'KEJAHATAN_SIBER', deskripsiSektor: 'Kejahatan Siber', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'CEGAH_TANGKAL', deskripsiSektor: 'Cegah Tangkal', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'PENGAWASAN_ORANG_ASING', deskripsiSektor: 'Pengawasan Orang Asing', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'PENGAMANAN_SUMBER_DAYA_ORGANISASI_KEJAKSAAN', deskripsiSektor: 'Pengamanan Sumber Daya Organisasi Kejaksaan', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
            { namaSektor: 'PENGAMANAN_PENANGANAN_PERKARA', deskripsiSektor: 'Pengamanan Penanganan Perkara', bidangDirektorat: BidangDirektorat[BidangDirektorat.IPOLHANKAM] },
        
            // Sosial, Budaya, dan Kemasyarakatan
            { namaSektor: 'PENGAWASAN_BARCET_DALAM_NEGERI', deskripsiSektor: 'Pengawasan Peredaran Barang Cetakan Dalam Negeri', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PENGAWASAN_BARCET_IMPORT', deskripsiSektor: 'Pengawasan Peredaran Import Barang Cetakan', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PENGAWASAN_SISTEM_PEMBUKUAN', deskripsiSektor: 'Pengawasan Sistem Pembukuan', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PENGAWASAN_MEDIA_KOMUNIKASI', deskripsiSektor: 'Pengawasan Media Komunikasi', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PAKEM', deskripsiSektor: 'Pengawasan Aliran Kepercayaan dan Keagamaan dalam Masyarakat', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PENCEGAHAN_PENYALAHGUNAAN_PENODAAN_AGAMA', deskripsiSektor: 'Pencegahan Penyalahgunaan dan/atau Penodaan Agama', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'KETAHANAN_BUDAYA', deskripsiSektor: 'Ketahanan Budaya', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PEMBERDAYAAN_MASYARAKAT_DESA', deskripsiSektor: 'Pemberdayaan Masyarakat Desa', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PENGAWASAN_ORMAS_LSM', deskripsiSektor: 'Pengawasan Organisasi Masyarakat dan Lembaga Swadaya Masyarakat', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PENCEGAHAN_KONFLIK_SOSIAL', deskripsiSektor: 'Pencegahan Konflik Sosial', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'KETERTIBAN_KETENTRAMAN_UMUM', deskripsiSektor: 'Ketertiban dan Ketentraman Umum', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },
            { namaSektor: 'PEMBINAAN_MASYARAKAT_TAAT_HUKUM', deskripsiSektor: 'Pembinaan Masyarakat Taat Hukum', bidangDirektorat: BidangDirektorat[BidangDirektorat.SOSBUDMAS] },

            // Ekonomi dan Keuangan
            { namaSektor: 'LEMBAGA_KEUANGAN', deskripsiSektor: 'Lembaga Keuangan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'KEUANGAN_NEGARA', deskripsiSektor: 'Keuangan Negara', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'MONETER', deskripsiSektor: 'Moneter', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'PENELUSURAN_ASET', deskripsiSektor: 'Penelusuran Aset', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'INVESTASI_PENANAMAN_MODAL', deskripsiSektor: 'Investasi / Penanaman Modal', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'PERPAJAKAN', deskripsiSektor: 'Perpajakan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'KEPABEANAN', deskripsiSektor: 'Kepabeanan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'CUKAI', deskripsiSektor: 'Cukai', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'PERDAGANGAN', deskripsiSektor: 'Perdagangan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'PERINDUSTRIAN', deskripsiSektor: 'Perindustrian', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'KETENAGAKERJAAN', deskripsiSektor: 'Ketenagakerjaan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'PERKEBUNAN', deskripsiSektor: 'Perkebunan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'KEHUTANAN', deskripsiSektor: 'Kehutanan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'LINGKUNGAN_HIDUP', deskripsiSektor: 'Lingkungan Hidup', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'PERIKANAN', deskripsiSektor: 'Perikanan', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },
            { namaSektor: 'AGRARIA_TATARUANG', deskripsiSektor: 'Agraria / Tataruang', bidangDirektorat: BidangDirektorat[BidangDirektorat.EKOKEU] },

            // Pengamanan Pembangunan Strategis
            { namaSektor: 'INFRASTRUKTUR_JALAN', deskripsiSektor: 'Infrastruktur Jalan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'INFRASTRUKTUR_PERKERETAAPIAN', deskripsiSektor: 'Infrastruktur Perkeretaapian', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'INFRASTRUKTUR_KEBANDARUDARAAN', deskripsiSektor: 'Infrastruktur Kebandarudaraan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'INFRASTRUKTUR_TELEKOMUNIKASI', deskripsiSektor: 'Infrastruktur Telekomunikasi', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'INFRASTRUKTUR_KEPELABUHAN', deskripsiSektor: 'Infrastruktur Kepelabuhan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'SMELTER', deskripsiSektor: 'Smelter', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'INFRASTRUKTUR_PENGOLAHAN_AIR', deskripsiSektor: 'Infrastruktur Pengolahan Air', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'TANGGUL', deskripsiSektor: 'Tanggul', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'BENDUNGAN', deskripsiSektor: 'Bendungan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'PERTANIAN', deskripsiSektor: 'Pertanian', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'KELAUTAN', deskripsiSektor: 'Kelautan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'KETENAGALISTRIKAN', deskripsiSektor: 'Ketenagalistrikan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'ENERGI_ALTERNATIF', deskripsiSektor: 'Energi Alternatif', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'MINYAK_GAS_BUMI', deskripsiSektor: 'Minyak dan Gas Bumi', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'IPTEK', deskripsiSektor: 'Ilmu Pengetahuan dan Teknologi', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'PERUMAHAN', deskripsiSektor: 'Perumahan', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'PARIWISATA', deskripsiSektor: 'Pariwisata', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'KAWASAN_INDUSTRI_PRIORITAS_KEK', deskripsiSektor: 'Kawasan Industri Prioritas / Kawasan Ekonomi Khusus', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'POS_LINTAS_BATAS_NEGARA_SARANA_PENUNJANG', deskripsiSektor: 'Pos Lintas Batas Negara dan Sarana Penunjang', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
            { namaSektor: 'SEKTOR_LAINNYA', deskripsiSektor: 'Sektor Lainnya', bidangDirektorat: BidangDirektorat[BidangDirektorat.PAMSTRA] },
        
            // Teknologi Informasi, dan Produksi Intelijen
            { namaSektor: 'PRODUKSI_INTELIJEN', deskripsiSektor: 'Produksi Intelijen', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'PEMANTAUAN', deskripsiSektor: 'Pemantauan', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'INTELIJEN_SINYAL', deskripsiSektor: 'Intelijen Sinyal', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'INTELIJEN_SIBER', deskripsiSektor: 'Intelijen Siber', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'KLANDESTINE', deskripsiSektor: 'Klandestine', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'DIGITAL_FORENSIK', deskripsiSektor: 'Digital Forensik', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'TRANSMISI_BERITA_SANDI', deskripsiSektor: 'Transmisi Berita Sandi', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'KONTRA_PENGINDERAAN', deskripsiSektor: 'Kontra Penginderaan', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'AUDIT_PENGUJIAN_SISTEM_KEAMANAN_INFORMASI', deskripsiSektor: 'Audit dan Pengujian Sistem Keamanan Informasi', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'PENGAMANAN_SINYAL', deskripsiSektor: 'Pengamanan Sinyal', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'PENGEMBANGAN_SDM_SANDI', deskripsiSektor: 'Pengembangan SDM dan Sandi', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'PENGEMBANGAN_SDM_INTELIJEN_LAINNYA', deskripsiSektor: 'Pengembangan SDM Intelijen Lainnya', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'PENGEMBANGAN_TEKNOLOGI', deskripsiSektor: 'Pengembangan Teknologi', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] },
            { namaSektor: 'PENGEMBANGAN_PROSEDUR_APLIKASI', deskripsiSektor: 'Pengembangan Prosedur dan Aplikasi', bidangDirektorat: BidangDirektorat[BidangDirektorat.TIPRODIN] }
        ];
        return sektor;
    }

}
