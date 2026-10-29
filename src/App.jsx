import { useEffect, useRef, useState } from "react";
import { profil, proyek, keahlian } from "./data.js";
import LatarDaun3D from "./LatarDaun3D.jsx";

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

function KartuKeahlian3D({ daftar }) {
  const panggungRef = useRef(null);
  const kartuRefs = useRef([]);
  const pilRefs = useRef([]);
  const infoNamaRef = useRef(null);
  const infoKategoriRef = useRef(null);
  const infoLogoRef = useRef(null);
  const infoTitikRef = useRef(null);

  const hoverIndeksRef = useRef(-1);
  const diDalamAreaRef = useRef(false);
  const sudutRef = useRef(0);
  const kecepatanRef = useRef(0.42);
  const bobotKartuRef = useRef(daftar.map(() => 0));
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ aktif: false, xAwal: 0, kecepatanTambahan: 0 });

  const perbaruiTampilanPusat = (indeks) => {
    const item = indeks >= 0 ? daftar[indeks] : null;
    if (infoNamaRef.current) {
      infoNamaRef.current.textContent = item ? item.nama : "8 Bahasa & Framework";
    }
    if (infoKategoriRef.current) {
      infoKategoriRef.current.textContent = item
        ? item.kategori
        : "Orbit 3D Interaktif · Geser atau Sentuh";
    }
    if (infoLogoRef.current) {
      if (item) {
        infoLogoRef.current.src = item.logo;
        infoLogoRef.current.style.opacity = "1";
        infoLogoRef.current.style.transform = "scale(1)";
      } else {
        infoLogoRef.current.style.opacity = "0.85";
        infoLogoRef.current.style.transform = "scale(0.92)";
      }
    }
    if (infoTitikRef.current) {
      infoTitikRef.current.style.backgroundColor = item ? item.warna : "#0284c7";
      infoTitikRef.current.style.boxShadow = item
        ? `0 0 12px ${item.warna}`
        : "0 0 10px #0284c7";
    }
    pilRefs.current.forEach((pil, idx) => {
      if (!pil) return;
      const terpilih = idx === indeks;
      pil.style.borderColor = terpilih
        ? daftar[idx].warna
        : "rgba(15, 23, 42, 0.15)";
      pil.style.transform = terpilih ? "translateY(-2px) scale(1.04)" : "none";
      pil.style.boxShadow = terpilih
        ? `0 10px 24px -6px ${daftar[idx].warna}66`
        : "";
    });
  };

  const pilihKartu = (indeks) => {
    hoverIndeksRef.current = indeks;
    perbaruiTampilanPusat(indeks);
  };

  useEffect(() => {
    let frameId;
    let waktuTerakhir = performance.now();

    const animasikan = (waktuSekarang) => {
      const dt = Math.min((waktuSekarang - waktuTerakhir) / 1000, 0.05);
      waktuTerakhir = waktuSekarang;

      const targetKecepatan =
        hoverIndeksRef.current >= 0
          ? 0.11
          : diDalamAreaRef.current
            ? 0.22
            : 0.42;

      kecepatanRef.current +=
        (targetKecepatan - kecepatanRef.current) * Math.min(1, dt * 1.6);

      dragRef.current.kecepatanTambahan *= Math.pow(0.92, dt * 60);

      sudutRef.current =
        (sudutRef.current +
          (kecepatanRef.current + dragRef.current.kecepatanTambahan) * dt) %
        (Math.PI * 2);

      currentTiltRef.current.x +=
        (targetTiltRef.current.x - currentTiltRef.current.x) *
        Math.min(1, dt * 4.5);
      currentTiltRef.current.y +=
        (targetTiltRef.current.y - currentTiltRef.current.y) *
        Math.min(1, dt * 4.5);

      const mobile = window.innerWidth < 640;
      const radiusX = mobile ? 142 : 258;
      const radiusY = mobile ? 66 : 86;
      const radiusZ = mobile ? 95 : 165;
      const total = daftar.length;

      for (let i = 0; i < total; i++) {
        const el = kartuRefs.current[i];
        if (!el) continue;

        const targetBobot = hoverIndeksRef.current === i ? 1 : 0;
        bobotKartuRef.current[i] +=
          (targetBobot - bobotKartuRef.current[i]) * Math.min(1, dt * 5.2);
        const bobot = bobotKartuRef.current[i];

        const sudut = sudutRef.current + (i * Math.PI * 2) / total;
        const cosS = Math.cos(sudut);
        const sinS = Math.sin(sudut);

        const kedalaman = (sinS + 1) / 2;
        const kedalamanHalus =
          kedalaman * kedalaman * (3 - 2 * kedalaman);

        const x = cosS * radiusX + currentTiltRef.current.x * 14 * (kedalaman - 0.5);
        const y =
          sinS * radiusY +
          Math.sin(sudut * 2 + waktuSekarang * 0.0015) * 4 -
          bobot * 14 +
          currentTiltRef.current.y * 10;
        const z = sinS * radiusZ + bobot * 48;

        const rotY = -cosS * 32 * (1 - bobot * 0.75) + currentTiltRef.current.x * 8;
        const rotX = -sinS * 8 * (1 - bobot * 0.8) - currentTiltRef.current.y * 8;
        const rotZ = cosS * 4 * (1 - bobot);

        const skala = 0.78 + kedalamanHalus * 0.24 + bobot * 0.12;
        const opasitas = 0.9 + kedalamanHalus * 0.1 + bobot * (1 - (0.9 + kedalamanHalus * 0.1));

        const zIndex = Math.round(kedalaman * 100) + (bobot > 0.6 ? 120 : 10);

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${skala.toFixed(3)})`;
        el.style.opacity = Math.min(1, opasitas).toFixed(3);
        el.style.zIndex = String(zIndex);
      }

      frameId = requestAnimationFrame(animasikan);
    };

    frameId = requestAnimationFrame(animasikan);
    return () => cancelAnimationFrame(frameId);
  }, [daftar]);

  const saatGerakPanggung = (e) => {
    const el = panggungRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetTiltRef.current = { x: nx, y: ny };

    if (dragRef.current.aktif) {
      const dx = e.clientX - dragRef.current.xAwal;
      dragRef.current.xAwal = e.clientX;
      dragRef.current.kecepatanTambahan = dx * 0.045;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={panggungRef}
        onMouseEnter={() => {
          diDalamAreaRef.current = true;
        }}
        onMouseMove={saatGerakPanggung}
        onMouseLeave={() => {
          diDalamAreaRef.current = false;
          dragRef.current.aktif = false;
          targetTiltRef.current = { x: 0, y: 0 };
          pilihKartu(-1);
        }}
        onPointerDown={(e) => {
          dragRef.current.aktif = true;
          dragRef.current.xAwal = e.clientX;
        }}
        onPointerUp={() => {
          dragRef.current.aktif = false;
        }}
        className="stage-3d relative flex h-[360px] w-full max-w-[720px] cursor-grab select-none items-center justify-center active:cursor-grabbing sm:h-[420px]"
      >
        {/* Cincin orbit 3D berlapis di latar panggung */}
        <div
          style={{ transform: "rotateX(68deg)" }}
          className="pointer-events-none absolute h-[260px] w-[280px] rounded-full border border-slate-300/50 shadow-[0_0_50px_rgba(56,189,248,0.15),inset_0_0_40px_rgba(186,230,253,0.15)] sm:h-[340px] sm:w-[520px]"
        />
        <div
          style={{ transform: "rotateX(68deg)" }}
          className="pointer-events-none absolute h-[190px] w-[200px] rounded-full border border-dashed border-sky-300/40 sm:h-[250px] sm:w-[390px]"
        />

        {/* Inti Hologram 3D di Tengah Cincin - dinaikkan agar tidak bentrok */}
        <div className="liquid-glass-sub pointer-events-none absolute top-1 z-30 flex flex-col items-center justify-center rounded-3xl px-5 py-3.5 text-center shadow-lg sm:top-2">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              ref={infoTitikRef}
              className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] transition-colors duration-300"
            />
            <img
              ref={infoLogoRef}
              src={daftar[3].logo}
              alt=""
              className="h-5 w-5 object-contain transition-all duration-300"
            />
          </div>
          <p
            ref={infoNamaRef}
            className="text-xs font-extrabold tracking-tight text-slate-800 sm:text-sm"
          >
            8 Bahasa & Framework
          </p>
          <p
            ref={infoKategoriRef}
            className="mt-0.5 text-[10px] font-medium text-slate-500"
          >
            Orbit 3D Interaktif · Geser atau Sentuh
          </p>
        </div>

        {/* Kartu-kartu Bahasa yang Mengorbit dalam Ruang 3D */}
        {daftar.map((item, i) => (
          <button
            key={item.nama}
            ref={(el) => {
              kartuRefs.current[i] = el;
            }}
            type="button"
            onMouseEnter={() => pilihKartu(i)}
            onClick={() =>
              pilihKartu(hoverIndeksRef.current === i ? -1 : i)
            }
            style={{
              background: item.bgGradasi,
              borderColor: `${item.warna}88`,
              boxShadow: `0 18px 38px -10px ${item.warna}50, inset 0 1.5px 1px rgba(255,255,255,0.55), inset 0 -1px 2px ${item.warna}35`,
            }}
            className="orbit-3d-card group absolute flex h-34 w-26 cursor-pointer flex-col items-center justify-between rounded-[24px] border p-3 text-center backdrop-blur-xl sm:h-40 sm:w-32 sm:p-3.5"
          >
            <div className="flex w-full items-center justify-between">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: item.warna,
                  boxShadow: `0 0 8px ${item.warna}`,
                }}
              />
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide sm:text-[10px]"
                style={{
                  backgroundColor: `${item.warna}20`,
                  color: "#ffffff",
                }}
              >
                0{i + 1}
              </span>
            </div>

            <div
              style={{
                boxShadow: `0 8px 20px -6px ${item.warna}55`,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 p-2.5 ring-1 ring-white transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
            >
              <img
                src={item.logo}
                alt={`Logo ${item.nama}`}
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-extrabold tracking-tight text-white sm:text-[13px]">
                {item.nama}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[9px] font-semibold text-slate-100/80 sm:text-[10px]">
                {item.kategori}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Baris pill cepat untuk memilih kartu 3D */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {daftar.map((item, i) => (
          <button
            key={item.nama}
            ref={(el) => {
              pilRefs.current[i] = el;
            }}
            type="button"
            onMouseEnter={() => {
              diDalamAreaRef.current = true;
              pilihKartu(i);
            }}
            onMouseLeave={() => {
              diDalamAreaRef.current = false;
              pilihKartu(-1);
            }}
            onClick={() =>
              pilihKartu(hoverIndeksRef.current === i ? -1 : i)
            }
            className="liquid-glass-sub inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition duration-300"
          >
            <img src={item.logo} alt="" className="h-4 w-4 object-contain" />
            <span>{item.nama}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <div className="relative min-h-screen text-slate-800 antialiased">
      {/* Latar cahaya aurora lembut */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-blob-1 absolute -top-24 left-[8%] h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-[110px]" />
        <div className="ambient-blob-2 absolute top-[28%] right-[6%] h-[440px] w-[440px] rounded-full bg-blue-200/35 blur-[110px]" />
        <div className="ambient-blob-1 absolute bottom-[6%] left-[22%] h-[380px] w-[380px] rounded-full bg-indigo-100/40 blur-[110px]" />
      </div>

      {/* Animasi 3D Daun yang bergerak saat halaman di-scroll */}
      <LatarDaun3D />

      {/* Navigasi Mengambang Liquid Glass ala iOS */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="liquid-glass flex w-full max-w-3xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-slate-800"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.75)]" />
            <span>Gede Pasek</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white/60 hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={profil.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 md:inline-block"
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
            <span className="h-0.5 w-5 rounded-full bg-slate-900" />
            <span className="h-0.5 w-5 rounded-full bg-slate-900" />
          </button>
        </div>

        {menuTerbuka && (
          <nav className="liquid-glass absolute top-16 right-4 left-4 flex flex-col gap-1 rounded-3xl p-4 md:hidden">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuTerbuka(false)}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-white/50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="relative z-10 mx-auto max-w-6xl space-y-16 px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
        {/* HERO BENTO LIQUID GLASS */}
        <section id="top" className="scroll-mt-28">
          <div className="grid items-stretch gap-6 lg:grid-cols-1">
            {/* Kartu Profil Utama: Foto Bulat + Nama dalam satu kartu */}
            <div className="liquid-glass flex flex-col items-center justify-between gap-8 rounded-[36px] p-8 sm:flex-row sm:p-12">
              {/* Foto Profil Bulat */}
              <div className="flex-shrink-0">
                <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white/80 shadow-[0_0_40px_rgba(56,189,248,0.25)] sm:h-80 sm:w-80">
                  <img
                    src={profil.foto}
                    alt={profil.nama}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Nama & Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="liquid-glass-sub mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-sky-600">
                  <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_#38bdf8]" />
                  <span>{profil.lokasi}</span>
                </div>

                <NamaHero nama={profil.nama} />

                <p className="mt-4 text-base font-semibold text-sky-600 sm:text-lg">
                  {profil.peran}
                </p>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {profil.ringkas}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-700"
                  >
                    <span>Lihat Karya</span>
                    <span>→</span>
                  </a>
                  <a
                    href="#keahlian"
                    className="liquid-glass-sub inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white/80"
                  >
                    Bahasa Pemrograman
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEAHLIAN - ORBIT 3D INTERAKTIF */}
        <section id="keahlian" className="scroll-mt-28">
          <Reveal>
            <div className="liquid-glass rounded-[36px] p-6 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-sky-600">
                  3D Tech Stack Orbit
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                  Bahasa yang Saya Pahami
                </h2>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  Cincin 3D interaktif yang terus mengorbit secara mulus.
                  Gerakkan kursor untuk memiringkan sudut pandang 3D, atau
                  geser cincin untuk memutarnya.
                </p>
              </div>

              <div className="mt-4">
                <KartuKeahlian3D daftar={keahlian} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* KARYA TERPILIH (LIQUID GLASS, SUDUT MELENGKUNG) */}
        <section id="work" className="scroll-mt-28">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-sky-600">
                  Karya Terpilih
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                  Proyek yang Pernah Dibuat
                </h2>
              </div>
              <p className="text-sm text-slate-600">
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
                    <div className="flex justify-center">
                      <div className="inline-flex overflow-hidden rounded-[26px] border border-slate-200/80 shadow-[0_14px_32px_-10px_rgba(15,23,42,0.1)]">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="block max-h-[250px] w-auto max-w-full rounded-[26px] transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="liquid-glass-sub rounded-full px-3 py-1 text-xs font-semibold text-slate-600">
                        {item.kategori}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        #{item.nomor}
                      </span>
                    </div>

                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-800">
                      {item.judul}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4">
                    <span className="liquid-glass-sub inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-sky-600 transition group-hover:bg-sky-500 group-hover:text-white">
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
                <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-sky-600">
                  Tentang Saya
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
                  Mengenal Lebih Dekat
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  {profil.tentang.map((paragraf) => (
                    <p key={paragraf}>{paragraf}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="liquid-glass flex h-full flex-col justify-between rounded-[32px] p-8 sm:p-10">
                <div>
                  <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-sky-600">
                    Minat & Aktivitas
                  </span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-800">
                    Web Development & Video Game
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Menggabungkan ketelitian logika pemrograman dengan strategi
                    dan kreativitas dari dunia video game untuk menghasilkan
                    antarmuka web yang nyaman digunakan.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="liquid-glass-sub rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-slate-800">2+</p>
                    <p className="mt-1 text-xs font-medium text-slate-600">
                      Proyek Web
                    </p>
                  </div>
                  <div className="liquid-glass-sub rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-sky-600">8</p>
                    <p className="mt-1 text-xs font-medium text-slate-600">
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
              <span className="liquid-glass-sub inline-block rounded-full px-3.5 py-1 text-xs font-semibold text-sky-600">
                Kontak
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                Mari Terhubung di GitHub
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                Silakan kunjungi profil GitHub saya untuk melihat repositori
                kode dan perkembangan proyek terbaru yang sedang saya kerjakan.
              </p>
              <div className="mt-8">
                <a
                  href={profil.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-700"
                >
                  <span>Buka GitHub (@Destroy27)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/50 py-8 text-center text-xs font-medium text-slate-500">
        © 2026 {profil.nama}. Dirancang dengan antarmuka Liquid Glass & WebGL 3D.
      </footer>
    </div>
  );
}
