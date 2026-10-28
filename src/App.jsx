import { useEffect, useRef, useState } from "react";
import { profil, proyek, keahlian } from "./data.js";

const menu = [
  { label: "Beranda", href: "#top" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Karya", href: "#work" },
  { label: "Tentang", href: "#about" },
  { label: "Kontak", href: "#kontak" },
];

function NamaAnimasi({ nama }) {
  const bagian = nama.split(" ");
  const baris1 = bagian.slice(0, 2).join(" ");
  const baris2 = bagian.slice(2).join(" ");

  const renderBaris = (teks, mulai, aksen = false) => {
    const kata = teks.split(" ");
    let indeks = 0;
    return kata.map((k, w) => (
      <span key={w} className="mr-[0.25em] inline-block whitespace-nowrap">
        {k.split("").map((huruf) => {
          const delay = mulai + indeks * 100;
          indeks += 1;
          return (
            <span
              key={indeks}
              className={aksen ? "idle-char-accent" : "idle-char"}
              style={{ animationDelay: `${delay}ms` }}
            >
              {huruf}
            </span>
          );
        })}
      </span>
    ));
  };

  return (
    <h1 className="py-1 text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.12] font-extrabold tracking-tight text-[#1d1d1f]">
      <span className="block">{renderBaris(baris1, 0, false)}</span>
      <span className="mt-1 block">{renderBaris(baris2, 350, true)}</span>
    </h1>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTampil(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${tampil ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function KartuKeahlianMelingkar({ daftar }) {
  const [sudutDasar, setSudutDasar] = useState(0);
  const [aktif, setAktif] = useState(null);
  const [lebarLayar, setLebarLayar] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const onResize = () => setLebarLayar(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let frameId;
    let waktuTerakhir = performance.now();

    const putar = (waktuSekarang) => {
      const selisih = (waktuSekarang - waktuTerakhir) / 1000;
      waktuTerakhir = waktuSekarang;

      if (aktif === null) {
        setSudutDasar((prev) => (prev + selisih * 0.48) % (Math.PI * 2));
      }
      frameId = requestAnimationFrame(putar);
    };

    frameId = requestAnimationFrame(putar);
    return () => cancelAnimationFrame(frameId);
  }, [aktif]);

  const total = daftar.length;
  const mobile = lebarLayar < 640;
  // Radius dibuat rapat agar kartu bergerak melingkar sekaligus saling bertumpuk sebagian
  const radiusX = mobile ? 92 : 148;
  const radiusY = mobile ? 84 : 118;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-[390px] w-full max-w-[540px] items-center justify-center sm:h-[450px]"
        onMouseLeave={() => setAktif(null)}
      >
        {/* Lingkaran panduan halus ala iOS */}
        <div className="pointer-events-none absolute h-[210px] w-[230px] rounded-full border border-dashed border-black/10 sm:h-[270px] sm:w-[330px]" />
        <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-gradient-to-tr from-blue-200/40 via-pink-200/30 to-amber-100/40 blur-2xl sm:h-48 sm:w-48" />

        {daftar.map((item, i) => {
          const sudut = sudutDasar + (i * Math.PI * 2) / total;
          const x = Math.cos(sudut) * radiusX;
          const y = Math.sin(sudut) * radiusY;
          // Kedalaman berdasarkan posisi vertikal pada lingkaran (depan vs belakang)
          const kedalaman = (Math.sin(sudut) + 1) / 2;
          const sedangAktif = aktif === i;
          const skala = sedangAktif ? 1.14 : 0.84 + kedalaman * 0.22;
          const kemiringan = sedangAktif ? 0 : Math.cos(sudut) * 11;
          const zIndex = sedangAktif ? 120 : Math.round(kedalaman * 60) + 10;

          return (
            <button
              key={item.nama}
              type="button"
              onMouseEnter={() => setAktif(i)}
              onClick={() => setAktif(sedangAktif ? null : i)}
              style={{
                transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${skala.toFixed(3)}) rotate(${kemiringan.toFixed(1)}deg)`,
                zIndex,
                background: item.bgGradasi,
                borderColor: sedangAktif ? item.warna : `${item.warna}55`,
                boxShadow: sedangAktif
                  ? `0 22px 45px -10px ${item.warna}55, 0 4px 14px rgba(0,0,0,0.08)`
                  : `0 12px 28px -8px ${item.warna}33, 0 2px 6px rgba(0,0,0,0.05)`,
              }}
              className="group absolute flex h-40 w-32 cursor-pointer flex-col items-center justify-between rounded-[26px] border-2 p-4 text-center backdrop-blur-xl transition-shadow duration-300 sm:h-44 sm:w-36"
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.warna }}
                />
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
                  style={{
                    backgroundColor: `${item.warna}20`,
                    color: item.warna,
                  }}
                >
                  0{i + 1}
                </span>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 p-2.5 shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                <img
                  src={item.logo}
                  alt={`Logo ${item.nama}`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight text-[#1d1d1f]">
                  {item.nama}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[#6e6e73]">
                  {item.kategori}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Baris pill interaktif ala iOS untuk memilih kartu secara langsung */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {daftar.map((item, i) => {
          const terpilih = aktif === i;
          return (
            <button
              key={item.nama}
              type="button"
              onMouseEnter={() => setAktif(i)}
              onMouseLeave={() => setAktif(null)}
              onClick={() => setAktif(terpilih ? null : i)}
              style={{
                borderColor: terpilih ? item.warna : "rgba(0,0,0,0.08)",
                backgroundColor: terpilih ? `${item.warna}18` : "rgba(255,255,255,0.8)",
              }}
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f] shadow-xs backdrop-blur-md transition hover:-translate-y-0.5"
            >
              <img src={item.logo} alt="" className="h-4 w-4 object-contain" />
              <span>{item.nama}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased">
      {/* Latar cahaya lembut ala iOS */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      {/* Navigasi Mengambang ala Dynamic Island iOS */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="ios-glass flex w-full max-w-3xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span>Gede Pasek</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#515154] transition hover:bg-black/5 hover:text-[#1d1d1f]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={profil.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#1d1d1f] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#333336] md:inline-block"
          >
            GitHub
          </a>

          <button
            type="button"
            onClick={() => setMenuTerbuka(!menuTerbuka)}
            aria-expanded={menuTerbuka}
            aria-label="Buka menu"
            className="flex flex-col gap-1 p-1.5 md:hidden"
          >
            <span className="h-0.5 w-5 rounded-full bg-[#1d1d1f]" />
            <span className="h-0.5 w-5 rounded-full bg-[#1d1d1f]" />
          </button>
        </div>

        {menuTerbuka && (
          <nav className="ios-glass absolute top-16 right-4 left-4 flex flex-col gap-1 rounded-3xl p-4 md:hidden">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuTerbuka(false)}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#1d1d1f] transition hover:bg-black/5"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl space-y-20 px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
        {/* HERO BENTO iOS */}
        <section id="top" className="scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            {/* Kartu Utama Hero */}
            <div className="ios-card flex flex-col justify-between rounded-[36px] p-8 sm:p-12">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-[#0071e3]">
                  <span className="h-2 w-2 rounded-full bg-[#0071e3]" />
                  <span>Portofolio Resmi · {profil.lokasi}</span>
                </div>

                <NamaAnimasi nama={profil.nama} />

                <p className="mt-4 text-base font-semibold text-[#0071e3] sm:text-lg">
                  {profil.peran}
                </p>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#515154] sm:text-lg">
                  {profil.ringkas}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0077ed]"
                >
                  <span>Lihat Karya</span>
                  <span>→</span>
                </a>
                <a
                  href="#keahlian"
                  className="inline-flex items-center gap-2 rounded-full bg-black/5 px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-black/10"
                >
                  Bahasa Pemrograman
                </a>
              </div>
            </div>

            {/* Kartu Widget Foto Profil ala iOS */}
            <div className="ios-card relative flex flex-col justify-between overflow-hidden rounded-[36px] p-4 sm:p-5">
              <div className="relative aspect-square w-full overflow-hidden rounded-[28px]">
                <img
                  src={profil.foto}
                  alt={profil.nama}
                  className="h-full w-full object-cover"
                />
                <div className="ios-glass absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-[#1d1d1f]">
                      {profil.nama}
                    </p>
                    <p className="text-[11px] font-medium text-[#515154]">
                      {profil.peran}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] font-semibold text-white">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEAHLIAN - KARTU MELINGKAR & SALING BERTUMPUK */}
        <section id="keahlian" className="scroll-mt-28">
          <Reveal>
            <div className="ios-card rounded-[36px] p-6 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-block rounded-full bg-black/5 px-3.5 py-1 text-xs font-semibold text-[#515154]">
                  Bahasa & Teknologi
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                  Bahasa yang Saya Pahami
                </h2>
                <p className="mt-2 text-sm text-[#515154] sm:text-base">
                  Kartu berputar secara melingkar dan saling bertumpuk sesuai
                  warna identitas masing-masing bahasa. Sentuh atau arahkan
                  kursor pada kartu untuk melihat lebih jelas.
                </p>
              </div>

              <div className="mt-6">
                <KartuKeahlianMelingkar daftar={keahlian} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* KARYA TERPILIH (TANPA BACKGROUND WARNA TAMBAHAN) */}
        <section id="work" className="scroll-mt-28">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="inline-block rounded-full bg-black/5 px-3.5 py-1 text-xs font-semibold text-[#515154]">
                  Karya Terpilih
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                  Proyek yang Pernah Dibuat
                </h2>
              </div>
              <p className="text-sm text-[#515154]">
                Menampilkan 2 proyek pilihan
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {proyek.map((item, i) => (
              <Reveal key={item.judul} delay={i * 100}>
                <a
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="ios-card group flex h-full flex-col justify-between rounded-[32px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
                >
                  <div>
                    {/* Gambar ditampilkan apa adanya tanpa latar warna merah/lainnya */}
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="max-h-[280px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-[#515154]">
                        {item.kategori}
                      </span>
                      <span className="text-xs font-semibold text-[#86868b]">
                        #{item.nomor}
                      </span>
                    </div>

                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#1d1d1f]">
                      {item.judul}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#515154] sm:text-base">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#0071e3]/10 px-4 py-2 text-xs font-semibold text-[#0071e3] transition group-hover:bg-[#0071e3] group-hover:text-white">
                      <span>Kunjungi Website</span>
                      <span>↗</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TENTANG SAYA & HOBI (WIDGET iOS) */}
        <section id="about" className="scroll-mt-28">
          <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
            <Reveal>
              <div className="ios-card h-full rounded-[32px] p-8 sm:p-10">
                <span className="inline-block rounded-full bg-black/5 px-3.5 py-1 text-xs font-semibold text-[#515154]">
                  Tentang Saya
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Mengenal Lebih Dekat
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-[#515154]">
                  {profil.tentang.map((paragraf) => (
                    <p key={paragraf}>{paragraf}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="ios-card flex h-full flex-col justify-between rounded-[32px] p-8 sm:p-10">
                <div>
                  <span className="inline-block rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-[#0071e3]">
                    Minat & Aktivitas
                  </span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight">
                    Web Development & Video Game
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#515154]">
                    Menggabungkan ketelitian logika pemrograman dengan strategi
                    dan kreativitas dari dunia video game untuk menghasilkan
                    antarmuka web yang nyaman digunakan.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-black/[0.03] p-4">
                    <p className="text-2xl font-extrabold text-[#1d1d1f]">2+</p>
                    <p className="mt-1 text-xs font-medium text-[#515154]">
                      Proyek Web
                    </p>
                  </div>
                  <div className="rounded-2xl bg-black/[0.03] p-4">
                    <p className="text-2xl font-extrabold text-[#0071e3]">8</p>
                    <p className="mt-1 text-xs font-medium text-[#515154]">
                      Bahasa & Alat
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* KONTAK */}
        <section id="kontak" className="scroll-mt-28">
          <Reveal>
            <div className="ios-card rounded-[36px] p-8 text-center sm:p-14">
              <span className="inline-block rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-[#0071e3]">
                Kontak
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                Mari Terhubung di GitHub
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#515154] sm:text-base">
                Silakan kunjungi profil GitHub saya untuk melihat repositori
                kode dan perkembangan proyek terbaru yang sedang saya kerjakan.
              </p>
              <div className="mt-8">
                <a
                  href={profil.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#333336]"
                >
                  <span>Buka GitHub (@Destroy27)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-black/5 py-8 text-center text-xs font-medium text-[#86868b]">
        © 2026 {profil.nama}. Dirancang dengan gaya antarmuka modern.
      </footer>
    </div>
  );
}
