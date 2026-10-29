// Ubah isi file ini untuk memperbarui seluruh portofolio.

const basis = import.meta.env.BASE_URL;

export const profil = {
  nama: "Gede Pasek Ary Sugiantara",
  peran: "Web Developer & Gamer",
  lokasi: "Bali, Indonesia",
  ringkas:
    "Membangun website modern yang bersih, responsif, dan nyaman digunakan. Di luar dunia pemrograman, saya aktif bermain dan mengeksplorasi video game.",
  tentang: [
    "Nama saya Gede Pasek Ary Sugiantara. Saya berfokus pada pengembangan web modern dengan antarmuka yang rapi, intuitif, dan cepat diakses di berbagai perangkat.",
    "Di luar aktivitas koding, saya memiliki hobi bermain video game. Kebiasaan tersebut melatih ketelitian, pemecahan masalah, strategi, serta koordinasi tim yang saya terapkan saat membangun produk digital.",
    "Saya selalu terbuka untuk diskusi proyek baru, kolaborasi kreatif, maupun bertukar pikiran seputar teknologi web dan dunia game.",
  ],
  foto: `${basis}assets/foto-profil.jpeg`,
  github: "https://github.com/Destroy27",
};

export const proyek = [
  {
    nomor: "01",
    kategori: "Brand & Web Platform",
    judul: "Website Jarco",
    deskripsi:
      "Platform web untuk Jaringan Coffee (Jarco) yang dirancang dengan tampilan bersih dan navigasi produk yang jelas.",
    link: "#",
    gambar: `${basis}assets/logo-jarco.jpg`,
  },
  {
    nomor: "02",
    kategori: "Web Application",
    judul: "Website Jurnal 7 KAIH",
    deskripsi:
      "Aplikasi jurnal kebiasaan baik harian untuk siswa SD Negeri 4 Jehem, dilengkapi pelacakan kegiatan harian, kalender kemajuan, serta lencana penghargaan.",
    link: "https://destroy27.github.io/jurnal-7-anak-indonesia-hebat/",
    gambar: `${basis}assets/Jurnal 7 KAIH.png`,
  },
  {
    nomor: "03",
    kategori: "Game Development",
    judul: "Game Sederhana Sistem Pencernaan",
    deskripsi:
      "Game edukasi interaktif untuk mempelajari sistem pencernaan manusia dengan cara yang menyenangkan.",
    link: "#",
    gambar: `${basis}assets/game-pencernaan.png`,
  },
];

export const galeri = [
  {
    judul: "Foto 1",
    kategori: "Fotografi",
    gambar: `${basis}assets/galeri/foto-1.jpg`,
  },
  {
    judul: "Foto 2",
    kategori: "Fotografi",
    gambar: `${basis}assets/galeri/foto-2.jpg`,
  },
  {
    judul: "Video 1",
    kategori: "Videografi",
    gambar: `${basis}assets/galeri/video-1.jpg`,
  },
  {
    judul: "Video 2",
    kategori: "Videografi",
    gambar: `${basis}assets/galeri/video-2.jpg`,
  },
];

export const keahlian = [
  {
    nama: "HTML5",
    kategori: "Struktur Web",
    warna: "#FF5722",
    bgGradasi:
      "linear-gradient(150deg, rgba(124, 45, 28, 0.95) 0%, rgba(18, 25, 46, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  },
  {
    nama: "CSS3",
    kategori: "Tata Letak & Visual",
    warna: "#38BDF8",
    bgGradasi:
      "linear-gradient(150deg, rgba(18, 78, 120, 0.95) 0%, rgba(16, 24, 46, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  },
  {
    nama: "JavaScript",
    kategori: "Logika Interaktif",
    warna: "#FACC15",
    bgGradasi:
      "linear-gradient(150deg, rgba(115, 90, 18, 0.95) 0%, rgba(18, 25, 46, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  },
  {
    nama: "React",
    kategori: "Frontend UI",
    warna: "#22D3EE",
    bgGradasi:
      "linear-gradient(150deg, rgba(16, 88, 110, 0.95) 0%, rgba(15, 23, 45, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    nama: "Tailwind CSS",
    kategori: "Design System",
    warna: "#06B6D4",
    bgGradasi:
      "linear-gradient(150deg, rgba(14, 82, 102, 0.95) 0%, rgba(15, 23, 45, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    nama: "Laravel",
    kategori: "Framework Backend",
    warna: "#F43F5E",
    bgGradasi:
      "linear-gradient(150deg, rgba(122, 28, 52, 0.95) 0%, rgba(18, 24, 46, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
  },
  {
    nama: "PHP",
    kategori: "Pemrograman Server",
    warna: "#A78BFA",
    bgGradasi:
      "linear-gradient(150deg, rgba(68, 52, 126, 0.95) 0%, rgba(17, 24, 46, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  },
  {
    nama: "Java",
    kategori: "Pemrograman Objek",
    warna: "#FB923C",
    bgGradasi:
      "linear-gradient(150deg, rgba(120, 62, 22, 0.95) 0%, rgba(18, 25, 46, 0.96) 100%)",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  },
];
