/**
 * =============================================================================
 * DATA KONFIGURASI WEBSITE PERSONAL PROFILE (EDISI NETFLIX)
 * =============================================================================
 * Data resmi: Audia Agustina Rahman
 * =============================================================================
 */

const PERSONAL_DATA = {
  // ---------------------------------------------------------------------------
  // 1. INFORMASI PROFIL UTAMA (HERO BILLBOARD & HEADLINE)
  // ---------------------------------------------------------------------------
  profile: {
    namaLengkap: "Audia Agustina Rahman",
    username: "audiaagustina",
    judulKarya: "AUDIA AGUSTINA RAHMAN",
    tagline: "Seri Profil Asli Netflix",
    bio: "", // Sinopsis dihapus sesuai permintaan
    lokasi: "Sampit, Kalimantan Tengah",
    asalDaerah: "Sampit, Kalimantan Tengah",
    tanggalLahir: "13 Agustus 2006",
    tempatLahir: "Sampit",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Puput Ujung Gg Marine",
    pendidikan: "S1 Sosial Ekonomi Perikanan",
    status: "Mahasiswa Aktif",
    tanggalBergabung: "Maret 2024",
    website: "https://instagram.com/audiaagustina",
    email: "audia.agustina@example.com",
    telepon: "+62 812-3456-7890",

    // Netflix Badges & Metadata
    matchRate: "99% Cocok",
    tahun: "2026",
    usiaRating: "18+",
    durasiMusim: "1 Musim (7 Episode Biodata)",
    resolusi: "Ultra HD 4K",
    audio: "5.1 Surround Sound",
    genre: ["Sosial Ekonomi Perikanan", "Musik", "Seni Vokal", "Dokumentasi"],

    // Asset Files
    fotoProfil: "assets/images/profile.jpg",
    fotoBanner: "assets/images/banner.jpg",

    // Deskripsi Lengkap / Sinopsis dihapus
    deskripsiLengkap: ""
  },

  // ---------------------------------------------------------------------------
  // 2. BIODATA DIRI (7 POIN UTAMA - TANPA DESKRIPSI SINGKAT)
  // ---------------------------------------------------------------------------
  biodata: {
    namaLengkap: "Audia Agustina Rahman",
    tempatLahir: "Sampit",
    tanggalLahir: "13 Agustus 2006",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Puput Ujung Gg Marine",
    asalDaerah: "Sampit, Kalimantan Tengah",
    pendidikan: "S1 Sosial Ekonomi Perikanan",
    status: "Mahasiswa Aktif",
    deskripsiSingkat: "", // Dihapus sesuai permintaan
    
    // Rincian 7 Episode untuk carousel "Lanjutkan Menonton"
    episodes: [
      {
        ep: 1,
        judul: "Identitas Diri",
        subjudul: "Nama Lengkap",
        nilai: "Audia Agustina Rahman",
        progress: 100,
        durasi: "03 menit",
        deskripsi: "Nama lengkap resmi pemilik profil portofolio."
      },
      {
        ep: 2,
        judul: "Kelahiran",
        subjudul: "Tempat & Tanggal Lahir",
        nilai: "Sampit, 13 Agustus 2006",
        progress: 95,
        durasi: "04 menit",
        deskripsi: "Lahir di Sampit, Kalimantan Tengah pada tanggal 13 Agustus 2006."
      },
      {
        ep: 3,
        judul: "Data Personal",
        subjudul: "Jenis Kelamin",
        nilai: "Perempuan",
        progress: 90,
        durasi: "02 menit",
        deskripsi: "Jenis kelamin perempuan."
      },
      {
        ep: 4,
        judul: "Domisili",
        subjudul: "Alamat Tempat Tinggal",
        nilai: "Jl. Puput Ujung Gg Marine",
        progress: 85,
        durasi: "05 menit",
        deskripsi: "Alamat tempat tinggal di Jl. Puput Ujung Gg Marine."
      },
      {
        ep: 5,
        judul: "Daerah Asal",
        subjudul: "Asal Daerah",
        nilai: "Sampit, Kalimantan Tengah",
        progress: 80,
        durasi: "03 menit",
        deskripsi: "Berasal dari Sampit, Kabupaten Kotawaringin Timur, Kalimantan Tengah."
      },
      {
        ep: 6,
        judul: "Jenjang Pendidikan",
        subjudul: "Pendidikan Saat Ini",
        nilai: "S1 Sosial Ekonomi Perikanan",
        progress: 75,
        durasi: "06 menit",
        deskripsi: "Menempuh pendidikan tinggi program sarjana S1 Sosial Ekonomi Perikanan."
      },
      {
        ep: 7,
        judul: "Status Personal",
        subjudul: "Status Saat Ini",
        nilai: "Mahasiswa Aktif",
        progress: 70,
        durasi: "02 menit",
        deskripsi: "Status personal saat ini sebagai mahasiswa aktif."
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 3. TOP HOBI & KEGIATAN FAVORIT: BERNYANYI & BERMAIN MUSIK
  // ---------------------------------------------------------------------------
  hobi: [
    {
      rank: 1,
      id: "hobi-1",
      judul: "Bernyanyi",
      kategori: "Serial Musik & Olah Vokal",
      gambar: "assets/images/hobi-1.jpg",
      icon: "🎤",
      match: "99% Cocok",
      rating: "SU",
      tags: ["Vokal", "Lagu Favorit", "Musik", "Melodi"],
      deskripsi: "Mengekspresikan diri melalui alunan vokal dan menyanyikan berbagai genre lagu favorit di waktu luang."
    },
    {
      rank: 2,
      id: "hobi-2",
      judul: "Bermain Musik",
      kategori: "Serial Eksplorasi Nada & Instrumen",
      gambar: "assets/images/hobi-2.jpg",
      icon: "🎵",
      match: "98% Cocok",
      rating: "SU",
      tags: ["Instrumen", "Harmoni", "Nada", "Akustik"],
      deskripsi: "Memainkan instrumen musik, mempelajari progresi akord, dan menciptakan harmonisasi nada yang merdu."
    }
  ],

  // ---------------------------------------------------------------------------
  // 4. GALERI FOTO RUMAH - DOKUMENTASI LENGKAP RUMAH
  // ---------------------------------------------------------------------------
  galeriRumah: [
    {
      id: "rumah-depan",
      kategori: "Tampak Bagian Tengah / Depan",
      badge: "Bagian Tengah",
      file: "assets/images/rumah-depan.jpg",
      judul: "Fasad Depan & Halaman Utama",
      subjudul: "Tampak Bagian Tengah",
      durasi: "Eksklusif HD",
      match: "99% Cocok",
      deskripsi: "Dokumentasi tampak depan bangunan rumah di Jl. Puput Ujung Gg Marine dengan pagar ornamen batu alam dan fasad bercat biru muda."
    },
    {
      id: "rumah-kiri",
      kategori: "Tampak Samping Kiri Rumah",
      badge: "Samping Kiri",
      file: "assets/images/rumah-kiri.jpg",
      judul: "Perspektif Sisi Kiri Bangunan",
      subjudul: "Tampak Samping Kiri",
      durasi: "Eksklusif HD",
      match: "98% Cocok",
      deskripsi: "Dokumentasi tampak samping kiri memperlihatkan pagar tembok pilar hijau dan dinding samping rumah."
    },
    {
      id: "rumah-kanan",
      kategori: "Tampak Samping Kanan Rumah",
      badge: "Samping Kanan",
      file: "assets/images/rumah-kanan.jpg",
      judul: "Perspektif Sisi Kanan Bangunan",
      subjudul: "Tampak Samping Kanan",
      durasi: "Eksklusif HD",
      match: "97% Cocok",
      deskripsi: "Dokumentasi tampak samping kanan memperlihatkan gerbang hitam dan area carport akses masuk."
    }
  ],

  // ---------------------------------------------------------------------------
  // 5. VIDEO PRIBADI (SESUAI POIN 6 PROMPT)
  // ---------------------------------------------------------------------------
  video: {
    judul: "Video Dokumentasi Rumah & Perkenalan Diri",
    subjudul: "Episode Spesial Portofolio",
    deskripsi: "Video dokumentasi 4 sisi rumah dan perkenalan diri Audia Agustina Rahman.",
    fileVideo: "assets/videos/video-perkenalan.mp4",
    fileThumbnail: "assets/images/video-thumbnail.jpg",
    durasi: "02:45",
    durasiDetik: 165,
    tahun: "2026",
    rating: "SU",
    kualitas: "Ultra HD 4K",
    tags: ["#NetflixOriginal", "#AudiaAgustinaRahman", "#DokumentasiRumah", "#TugasSistem"]
  },

  // ---------------------------------------------------------------------------
  // 6. TIMELINE / POSTINGAN & UPDATE TERBARU (SESUAI POIN 7 PROMPT)
  // ---------------------------------------------------------------------------
  posts: [
    {
      id: "post-1",
      tanggal: "14 Oktober 2026",
      judul: "Rilis Portofolio Pribadi Audia Agustina Rahman",
      isi: "Selamat datang di website profil personal dan dokumentasi saya. Memuat biodata diri lengkap, hobi bernyanyi dan bermain musik, galeri 4 sudut rumah, serta video perkenalan.",
      kategori: "Episode Perdana",
      media: null,
      likes: 350,
      shares: 65
    },
    {
      id: "post-2",
      tanggal: "12 Oktober 2026",
      judul: "Dokumentasi 4 Sisi Rumah",
      isi: "Dokumentasi lengkap 4 sisi rumah: tampak depan, belakang, samping kiri, dan samping kanan untuk tugas sistem. Foto dapat diperbesar dengan klik pada kartu galeri.",
      kategori: "Dokumentasi",
      media: "assets/images/rumah-depan.jpg",
      likes: 210,
      shares: 32
    },
    {
      id: "post-3",
      tanggal: "10 Oktober 2026",
      judul: "Aktivitas Hobi: Bernyanyi & Bermain Musik",
      isi: "Mengisi waktu luang dengan bernyanyi lagu favorit dan memainkan instrumen musik.",
      kategori: "Hobi & Musik",
      media: "assets/images/hobi-1.jpg",
      likes: 280,
      shares: 48
    }
  ],

  // Profil Switcher ala Netflix ("Siapa yang menonton?")
  profiles: [
    { id: "p1", name: "Audia Agustina", role: "Pemilik Profil", color: "bg-red-600", active: true },
    { id: "p2", name: "Dosen / Penguji", role: "Reviewer Sistem", color: "bg-blue-600", active: false },
    { id: "p3", name: "Tamu Umum", role: "Pengunjung", color: "bg-yellow-500", active: false }
  ]
};
