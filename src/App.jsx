import { useEffect, useRef, useState } from "react";
import { profil, proyek, keahlian } from "./data.js";

const menu = [
  { label: "Beranda", href: "#top" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Karya", href: "#work" },
  { label: "Tentang", href: "#about" },
  { label: "Kontak", href: "#kontak" },
];

function NamaHero({ nama }) {
  const bagian = nama.split(" ");
  const barisAtas = bagian.slice(0, 2).join(" ");
  const barisBawah = bagian.slice(2).join(" ");
  const wadahRef = useRef(null);

  const saatGerakKursor = (e) => {
    const el = wadahRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate3d(${(x * 8).toFixed(1)}px, ${(y * 6).toFixed(1)}px, 0)`;
  };

  const saatKeluarKursor = () => {
    const el = wadahRef.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={wadahRef}
      onMouseMove={saatGerakKursor}
      onMouseLeave={saatKeluarKursor}
      className="transition-transform duration-500 ease-out"
    >
      <h1 className="select-none text-[clamp(2.5rem,6.2vw,4.75rem)] leading-[1.06] font-extrabold">
        <span className="hero-name-primary block">{barisAtas}</span>
        <span className="hero-name-liquid mt-1 block">{barisBawah}</span>
      </h1>
    </div>
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
  const [aktif, setAktif] = useState(null);
  const aktifRef = useRef(null);
  const areaHoverRef = useRef(false);
  const kartuRefs = useRef([]);
  const sudutRef = useRef(0);
  const kecepatanRef = useRef(0.38);
  const hoverBobotRef = useRef(daftar.map(() => 0));

  useEffect(() => {
    aktifRef.current = aktif;
  }, [aktif]);

  useEffect(() => {
    let frameId;
    let waktuTerakhir = performance.now();

    const animasikan = (waktuSekarang) => {
      const dt = Math.min((waktuSekarang - waktuTerakhir) / 1000, 0.05);
      waktuTerakhir = waktuSekarang;

      // Inersia halus (delay perlambatan) saat kursor masuk atau memilih kartu
      const sedangDihentikan =
         areaHoverRef.current || aktifRef.current !== null;
      const targetKecepatan = sedangDihentikan ? 0 : 0.38;
      kecepatanRef.current +=
        (targetKecepatan - kecepatanRef.current) * Math.min(1, dt * 3.2);

      sudutRef.current =
        (sudutRef.current + kecepatanRef.current * dt) % (Math.PI * 2);

      const mobile = window.innerWidth < 640;
      const radiusX = mobile ? 118 : 210;
      const radiusY = mobile ? 78 : 96;
      const total = daftar.length;

      for (let i = 0; i < total; i++) {
        const el = kartuRefs.current[i];
        if (!el) continue;

        const targetBobot = aktifRef.current === i ? 1 : 0;
        hoverBobotRef.current[i] +=
          (targetBobot - hoverBobotRef.current[i]) * Math.min(1, dt * 6.5);
        const bobot = hoverBobotRef.current[i];

        const sudut = sudutRef.current + (i * Math.PI * 2) / total;
        const x = Math.cos(sudut) * radiusX;
        const y = Math.sin(sudut) * radiusY - bobot * 12;

        // Kedalaman 0 (paling belakang) hingga 1 (paling depan)
        const kedalaman = (Math.sin(sudut) + 1) / 2;
        const kedalamanHalus = Math.pow(kedalaman, 1.35);

        // Skala dan kemiringan diinterpolasi dengan mulus tanpa patahan
        const skalaDasar = 0.76 + kedalamanHalus * 0.28;
        const skala = skalaDasar + bobot * (1.12 - skalaDasar);
        const kemiringan = Math.cos(sudut) * 8 * (1 - bobot);

        // Efek fade (transparansi) dan blur lembut untuk kartu di sisi belakang
        const opasitasDasar = 0.26 + kedalamanHalus * 0.74;
        const opasitas = opasitasDasar + bobot * (1 - opasitasDasar);
        const blurPx = (1 - kedalaman) * 1.6 * (1 - bobot);

        const zIndex =
          bobot > 0.45 ? 150 : Math.round(kedalaman * 80) + 10;

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${skala.toFixed(3)}) rotate(${kemiringan.toFixed(2)}deg)`;
        el.style.opacity = opasitas.toFixed(3);
        el.style.filter = blurPx > 0.15 ? `blur(${blurPx.toFixed(2)}px)` : "none";
        el.style.zIndex = String(zIndex);
      }

      frameId = requestAnimationFrame(animasikan);
    };

    frameId = requestAnimationFrame(animasikan);
    return () => cancelAnimationFrame(frameId);
  }, [daftar]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-[340px] w-full max-w-[640px] items-center justify-center sm:h-[390px]"
        onMouseEnter={() => {
          areaHoverRef.current = true;
        }}
        onMouseLeave={() => {
          areaHoverRef.current = false;
          setAktif(null);
        }}
      >
        {/* Jalur orbit tipis */}
        <div className="pointer-events-none absolute h-[170px] w-[260px] rounded-full border border-white/60 shadow-[inset_0_0_30px_rgba(255,255,255,0.5)] sm:h-[210px] sm:w-[440px]" />
        <div className="pointer-events-none absolute h-36 w-56 rounded-full bg-gradient-to-tr from-sky-300/30 via-fuchsia-200/25 to-amber-200/30 blur-3xl sm:h-48 sm:w-80" />

        {daftar.map((item, i) => {
          const sedangAktif = aktif === i;
          return (
            <button
              key={item.nama}
              ref={(el) => {
                kartuRefs.current[i] = el;
              }}
              type="button"
              onMouseEnter={() => setAktif(i)}
              onClick={() => setAktif(sedangAktif ? null : i)}
              style={{
                background: item.bgGradasi,
                borderColor: sedangAktif ? item.warna : "rgba(255,255,255,0.85)",
                boxShadow: sedangAktif
                  ? `0 24px 48px -10px ${item.warna}55, inset 0 1.5px 1px rgba(255,255,255,0.95)`
                  : `0 14px 32px -10px ${item.warna}30, inset 0 1.5px 1px rgba(255,255,255,0.9)`,
                willChange: "transform, opacity, filter",
              }}
              className="group absolute flex h-38 w-30 cursor-pointer flex-col items-center justify-between rounded-[26px] border p-3.5 text-center backdrop-blur-2xl transition-shadow duration-500 sm:h-42 sm:w-34 sm:p-4"
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: item.warna,
                    boxShadow: `0 0 8px ${item.warna}`,
                  }}
                />
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
                  style={{
                    backgroundColor: `${item.warna}22`,
                    color: item.warna,
                  }}
                >
                  0{i + 1}
                </span>
              </div>

              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/85 p-2.5 shadow-xs ring-1 ring-white transition-transform duration-500 group-hover:scale-110 sm:h-15 sm:w-15">
                <img
                  src={item.logo}
                  alt={`Logo ${item.nama}`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-bold tracking-tight text-[#141417] sm:text-sm">
                  {item.nama}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#515154]">
                  {item.kategori}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tombol pill bahasa dengan efek Liquid Glass */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {daftar.map((item, i) => {
          const terpilih = aktif === i;
          return (
            <button
              key={item.nama}
              type="button"
              onMouseEnter={() => {
                areaHoverRef.current = true;
                setAktif(i);
              }}
              onMouseLeave={() => {
                areaHoverRef.current = false;
                setAktif(null);
              }}
              onClick={() => setAktif(terpilih ? null : i)}
              style={{
                borderColor: terpilih ? item.warna : "rgba(255,255,255,0.85)",
                background: terpilih
                  ? `linear-gradient(135deg, ${item.warna}28, rgba(255,255,255,0.85))`
                  : undefined,
              }}
              className="liquid-glass-sub inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#141417] transition duration-300 hover:-translate-y-0.5"
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
    <div className="relative min-h-screen text-[#141417] antialiased">
      {/* Latar cairan warna pastel agar efek bias Liquid Glass terlihat nyata */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-blob-1 absolute -top-24 left-[8%] h-[420px] w-[420px] rounded-full bg-sky-300/45 blur-[95px]" />
        <div className="ambient-blob-2 absolute top-[28%] right-[6%] h-[440px] w-[440px] rounded-full bg-pink-300/40 blur-[100px]" />
        <div className="ambient-blob-1 absolute bottom-[6%] left-[22%] h-[380px] w-[380px] rounded-full bg-indigo-200/45 blur-[95px]" />
        <div className="ambient-blob-2 absolute top-[62%] left-[4%] h-[300px] w-[300px] rounded-full bg-teal-200/40 blur-[85px]" />
      </div>

      {/* Navigasi Mengambang Liquid Glass ala iOS */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="liquid-glass flex w-full max-w-3xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.75)]" />
            <span>Gede Pasek</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#3a3a3c] transition hover:bg-white/60 hover:text-[#141417]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={profil.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#141417] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2c2c30] md:inline-block"
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
            <span className="h-0.5 w-5 rounded-full bg-[#141417]" />
            <span className="h-0.5 w-5 rounded-full bg-[#141417]" />
          </button>
        </div>

        {menuTerbuka && (
          <nav className="liquid-glass absolute top-16 right-4 left-4 flex flex-col gap-1 rounded-3xl p-4 md:hidden">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuTerbuka(false)}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#141417] transition hover:bg-white/50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
        {/* HERO BENTO LIQUID GLASS */}
        <section id="top" className="scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            {/* Kartu Utama Hero */}
            <div className="liquid-glass flex flex-col justify-between rounded-[36px] p-8 sm:p-12">
              <div>
                <div className="liquid-glass-sub mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f]">
                  <span className="h-2 w-2 rounded-full bg-[#0071e3]" />
                  <span>{profil.lokasi}</span>
                </div>

                <NamaHero nama={profil.nama} />

                <p className="mt-4 text-base font-semibold text-[#0071e3] sm:text-lg">
                  {profil.peran}
                </p>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#3a3a3c] sm:text-lg">
                  {profil.ringkas}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-[#141417] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2c2c30]"
                >
                  <span>Lihat Karya</span>
                  <span>→</span>
                </a>
                <a
                  href="#keahlian"
                  className="liquid-glass-sub inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#141417] transition hover:-translate-y-0.5"
                >
                  Bahasa Pemrograman
                </a>
              </div>
            </div>

            {/* Kartu Widget Foto Profil Liquid Glass */}
            <div className="liquid-glass relative flex flex-col justify-between overflow-hidden rounded-[36px] p-4 sm:p-5">
              <div className="relative aspect-square w-full overflow-hidden rounded-[28px]">
                <img
                  src={profil.foto}
                  alt={profil.nama}
                  className="h-full w-full object-cover"
                />
                <div className="liquid-glass absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-[#141417]">
                      {profil.nama}
                    </p>
                    <p className="text-[11px] font-medium text-[#3a3a3c]">
                      {profil.peran}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#141417] px-3 py-1 text-[11px] font-semibold text-white">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEAHLIAN - KARTU MELINGKAR DENGAN EFEK FADE & INERSIA */}
        <section id="keahlian" className="scroll-mt-28">
          <Reveal>
            <div className="liquid-glass rounded-[36px] p-6 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-[#3a3a3c]">
                  Bahasa & Teknologi
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                  Bahasa yang Saya Pahami
                </h2>
                <p className="mt-2 text-sm text-[#3a3a3c] sm:text-base">
                  Kartu berputar mulus dengan efek bias kedalaman. Arahkan
                  kursor untuk memperlambat putaran secara perlahan.
                </p>
              </div>

              <div className="mt-4">
                <KartuKeahlianMelingkar daftar={keahlian} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* KARYA TERPILIH (LIQUID GLASS, TANPA BACKGROUND WARNA TAMBAHAN) */}
        <section id="work" className="scroll-mt-28">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-[#3a3a3c]">
                  Karya Terpilih
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                  Proyek yang Pernah Dibuat
                </h2>
              </div>
              <p className="text-sm text-[#3a3a3c]">
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
                  className="liquid-glass group flex h-full flex-col justify-between rounded-[32px] p-6 transition duration-300 hover:-translate-y-1 sm:p-8"
                >
                  <div>
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="max-h-[280px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="liquid-glass-sub rounded-full px-3 py-1 text-xs font-semibold text-[#3a3a3c]">
                        {item.kategori}
                      </span>
                      <span className="text-xs font-semibold text-[#6e6e73]">
                        #{item.nomor}
                      </span>
                    </div>

                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#141417]">
                      {item.judul}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#3a3a3c] sm:text-base">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4">
                    <span className="liquid-glass-sub inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#0071e3] transition group-hover:bg-[#0071e3] group-hover:text-white">
                      <span>Kunjungi Website</span>
                      <span>↗</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TENTANG SAYA & HOBI (LIQUID GLASS WIDGETS) */}
        <section id="about" className="scroll-mt-28">
          <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
            <Reveal>
              <div className="liquid-glass h-full rounded-[32px] p-8 sm:p-10">
                <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-[#3a3a3c]">
                  Tentang Saya
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Mengenal Lebih Dekat
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-[#3a3a3c]">
                  {profil.tentang.map((paragraf) => (
                    <p key={paragraf}>{paragraf}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="liquid-glass flex h-full flex-col justify-between rounded-[32px] p-8 sm:p-10">
                <div>
                  <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-[#0071e3]">
                    Minat & Aktivitas
                  </span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight">
                    Web Development & Video Game
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#3a3a3c]">
                    Menggabungkan ketelitian logika pemrograman dengan strategi
                    dan kreativitas dari dunia video game untuk menghasilkan
                    antarmuka web yang nyaman digunakan.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="liquid-glass-sub rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-[#141417]">2+</p>
                    <p className="mt-1 text-xs font-medium text-[#3a3a3c]">
                      Proyek Web
                    </p>
                  </div>
                  <div className="liquid-glass-sub rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-[#0071e3]">8</p>
                    <p className="mt-1 text-xs font-medium text-[#3a3a3c]">
                      Bahasa & Alat
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* KONTAK (LIQUID GLASS) */}
        <section id="kontak" className="scroll-mt-28">
          <Reveal>
            <div className="liquid-glass rounded-[36px] p-8 text-center sm:p-14">
              <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-[#0071e3]">
                Kontak
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                Mari Terhubung di GitHub
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#3a3a3c] sm:text-base">
                Silakan kunjungi profil GitHub saya untuk melihat repositori
                kode dan perkembangan proyek terbaru yang sedang saya kerjakan.
              </p>
              <div className="mt-8">
                <a
                  href={profil.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#141417] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2c2c30]"
                >
                  <span>Buka GitHub (@Destroy27)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/50 py-8 text-center text-xs font-medium text-[#6e6e73]">
        © 2026 {profil.nama}. Dirancang dengan antarmuka Liquid Glass.
      </footer>
    </div>
  );
}
