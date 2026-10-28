// Ubah isi file ini untuk memperbarui seluruh portofolio.

const basis = import.meta.env.BASE_URL;

export const profil = {
  nama: "Gede Pasek Ary Sugiantara",
  peran: "Web Developer dan Gamer",
  ringkas:
    "Saya membangun website yang bersih, responsif, dan berfokus pada pengalaman pengguna. Di luar dunia koding, saya suka bermain video game.",
  tentang: [
    "Nama saya Gede Pasek Ary Sugiantara. Saya tertarik pada pengembangan web dan selalu senang mencoba hal baru dalam membangun sebuah produk digital.",
    "Di luar pekerjaan koding, saya gemar bermain video game. Kebiasaan ini melatih ketelitian, strategi, dan kerja sama tim yang saya bawa ke dalam setiap proyek.",
    "Saya terbuka untuk diskusi proyek, kolaborasi, maupun sekadar bertukar ide tentang teknologi dan video game.",
  ],
  foto: `${basis}assets/foto-profil.jpeg`,
  github: "https://github.com/Destroy27",
};

export const proyek = [
  {
    nomor: "01",
    judul: "Website Jarco",
    deskripsi:
      "Website untuk jaringan coffee atau yang lebih dikenal dengan nama Jarco.",
    link: "#",
    gambar: `${basis}assets/logo-jarco.jpg`,
  },
  {
    nomor: "02",
    judul: "Website Jurnal 7 KAIH",
    deskripsi:
      "Aplikasi jurnal kebiasaan baik harian untuk murid SD, lengkap dengan pelacakan kegiatan, kalender kemajuan, dan lencana penghargaan.",
    link: "https://destroy27.github.io/jurnal-7-anak-indonesia-hebat/",
    gambar: `${basis}assets/Jurnal 7 KAIH.png`,
  },
];

// Daftar ini masih perkiraan. Sesuaikan dengan keahlian Tuan yang sebenarnya.
export const keahlian = [
  { nama: "HTML", ikon: "html5" },
  { nama: "CSS", ikon: "css3" },
  { nama: "JavaScript", ikon: "javascript" },
  { nama: "React", ikon: "react" },
  { nama: "Tailwind CSS", ikon: "tailwindcss" },
  { nama: "Laravel", ikon: "laravel" },
  { nama: "PHP", ikon: "php" },
  { nama: "Java", ikon: "openjdk" },
];

export const penghargaan = [
  {
    peringkat: "2",
    judul: "Juara 2 Lomba Video Game Tingkat Nasional",
    keterangan:
      "Pencapaian yang membanggakan dan menjadi motivasi untuk terus berkembang di bidang teknologi dan gaming.",
  },
];

// Isi dengan pelatihan yang pernah diikuti, contoh: { judul: "...", penyelenggara: "...", tahun: "..." }
export const pelatihan = [];
