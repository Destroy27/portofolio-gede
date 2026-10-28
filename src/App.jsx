import { useCallback, useEffect, useRef, useState } from "react";
import {
  profil,
  proyek,
  keahlian,
  penghargaan,
  pelatihan,
} from "./data.js";

const menu = [
  { label: "Work", href: "#work" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Tentang", href: "#about" },
  { label: "Penghargaan", href: "#awards" },
  { label: "Pelatihan", href: "#trainings" },
];

const warnaProyek = ["bg-[#f9c5d1]", "bg-[#c9e7dd]"];

function Loader({ onSelesai }) {
  const [keluar, setKeluar] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setKeluar(true), 2000);
    const b = setTimeout(onSelesai, 2500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onSelesai]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#f3efe7] transition-opacity duration-500 ${
        keluar ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Memuat portofolio"
    >
      <p className="text-sm font-semibold tracking-[0.35em] uppercase">
        Gede Pasek Ary Sugiantara
      </p>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTampil(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
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

function GarisAtas({ nomor, judul }) {
  return (
    <div className="mb-14 border-t-2 border-[#16161a] pt-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold tracking-widest uppercase">
          {judul}
        </span>
        <span className="serif text-sm italic">({nomor})</span>
      </div>
    </div>
  );
}

export default function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [memuat, setMemuat] = useState(true);
  const selesaiMemuat = useCallback(() => setMemuat(false), []);

  return (
    <div className="min-h-screen bg-[#f3efe7] text-[#16161a] antialiased">
      {memuat && <Loader onSelesai={selesaiMemuat} />}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between px-6 py-5 md:px-12">
          <a href="#top" className="text-lg font-extrabold tracking-tight">
            Gede<span className="text-[#e0568a]">.</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group text-sm font-medium transition hover:text-[#e0568a]"
              >
                <span className="mr-1 text-[10px] align-super">↗</span>
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuTerbuka(!menuTerbuka)}
            aria-expanded={menuTerbuka}
            aria-label="Buka menu"
            className="flex flex-col gap-1.5 p-1 md:hidden"
          >
            <span className="h-0.5 w-6 bg-[#16161a]" />
            <span className="h-0.5 w-6 bg-[#16161a]" />
            <span className="h-0.5 w-6 bg-[#16161a]" />
          </button>
        </div>

        {menuTerbuka && (
          <nav className="mx-6 flex flex-col gap-1 border-t-2 border-[#16161a] bg-[#f3efe7] py-4 md:hidden">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuTerbuka(false)}
                className="py-2 text-2xl font-bold tracking-tight"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="top" className="px-6 pt-32 pb-20 md:px-12 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center gap-4 text-xs font-semibold tracking-widest uppercase">
              <span>Portofolio © 2026</span>
              <span className="h-px flex-1 bg-[#16161a]/30" />
              <span>Bali, Indonesia</span>
            </div>

            <h1 className="text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.92] font-extrabold tracking-tight">
              GEDE PASEK
              <br />
              <span className="serif font-medium italic">Ary Sugiantara</span>
            </h1>

            <div className="mt-12 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div className="aspect-square max-w-sm overflow-hidden md:order-2 md:ml-auto">
                <img
                  src={profil.foto}
                  alt={profil.nama}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="md:order-1">
                <p className="mb-5 text-sm font-semibold tracking-widest uppercase">
                  {profil.peran}
                </p>
                <p className="serif max-w-md text-xl leading-snug text-[#16161a]/80 md:text-2xl">
                  {profil.ringkas}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#work"
                    className="group inline-flex items-center gap-2 border-2 border-[#16161a] px-6 py-3 text-sm font-semibold transition hover:bg-[#16161a] hover:text-[#f3efe7]"
                  >
                    Lihat Karya
                    <span className="transition group-hover:translate-x-1">→</span>
                  </a>
                  <a
                    href="#kontak"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold underline underline-offset-4"
                  >
                    Hubungi Saya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden border-y-2 border-[#16161a] py-4">
          <div className="marquee flex w-max whitespace-nowrap">
            {[0, 1].map((n) => (
              <div key={n} className="flex shrink-0 items-center">
                {keahlian.map((item) => (
                  <span
                    key={`${n}-${item}`}
                    className="mx-6 flex items-center gap-6 text-xl font-extrabold tracking-tight uppercase"
                  >
                    {item}
                    <span className="text-[#e0568a]">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* WORK */}
        <section id="work" className="scroll-mt-20 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <GarisAtas nomor="01" judul="Karya Terpilih" />
            </Reveal>

            <div className="grid gap-16">
              {proyek.map((item, i) => (
                <Reveal key={item.judul}>
                  <a
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group grid gap-8 md:grid-cols-2 md:items-center"
                  >
                    <div
                      className={`aspect-[4/3] overflow-hidden ${warnaProyek[i % warnaProyek.length]} ${
                        i % 2 === 1 ? "md:order-2" : ""
                      }`}
                    >
                      <div className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-105">
                        <span className="outline-text text-[7rem] leading-none font-extrabold md:text-[10rem]">
                          {item.nomor}
                        </span>
                      </div>
                    </div>

                    <div className={i % 2 === 1 ? "md:order-1" : ""}>
                      <span className="serif text-sm italic">
                        Proyek {item.nomor}
                      </span>
                      <h3 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
                        {item.judul}
                      </h3>
                      <p className="mt-5 max-w-md leading-relaxed text-[#16161a]/70">
                        {item.deskripsi}
                      </p>
                      <span className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#16161a] pb-1 text-sm font-semibold">
                        Kunjungi Website
                        <span className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* KEAHLIAN */}
        <section
          id="keahlian"
          className="scroll-mt-20 bg-[#16161a] px-6 py-24 text-[#f3efe7] md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-14 border-t-2 border-[#f3efe7] pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold tracking-widest uppercase">
                    Keahlian
                  </span>
                  <span className="serif text-sm italic">(02)</span>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
              {keahlian.map((item, i) => (
                <Reveal key={item} delay={i * 60}>
                  <div className="flex items-baseline justify-between border-b border-[#f3efe7]/20 py-4">
                    <span className="text-3xl font-bold tracking-tight">
                      {item}
                    </span>
                    <span className="text-xs tracking-widest uppercase text-[#f3efe7]/50">
                      0{i + 1}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TENTANG */}
        <section id="about" className="scroll-mt-20 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <GarisAtas nomor="03" judul="Tentang" />
            </Reveal>

            <div className="grid gap-12 md:grid-cols-[0.6fr_1.4fr]">
              <Reveal>
                <span className="serif text-2xl italic">
                  Siapa saya di balik layar.
                </span>
              </Reveal>
              <div className="space-y-6">
                {profil.tentang.map((paragraf, i) => (
                  <Reveal key={paragraf} delay={i * 80}>
                    <p className="serif text-2xl leading-snug text-[#16161a]/80 md:text-3xl">
                      {paragraf}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PENGHARGAAN */}
        <section id="awards" className="scroll-mt-20 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <GarisAtas nomor="04" judul="Penghargaan" />
            </Reveal>

            <div className="grid gap-6">
              {penghargaan.map((item) => (
                <Reveal key={item.judul}>
                  <article className="grid gap-6 border-2 border-[#16161a] p-8 md:grid-cols-[auto_1fr] md:items-center md:p-12">
                    <div className="serif text-7xl font-medium italic md:text-8xl">
                      #{item.peringkat}
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight md:text-4xl">
                        {item.judul}
                      </h3>
                      <p className="mt-3 max-w-xl leading-relaxed text-[#16161a]/70">
                        {item.keterangan}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PELATIHAN */}
        <section id="trainings" className="scroll-mt-20 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <GarisAtas nomor="05" judul="Pelatihan" />
            </Reveal>

            {pelatihan.length > 0 ? (
              <div className="grid gap-6">
                {pelatihan.map((item) => (
                  <Reveal key={item.judul}>
                    <article className="flex flex-col justify-between gap-2 border-b border-[#16161a]/30 py-6 md:flex-row md:items-baseline">
                      <h3 className="text-2xl font-bold tracking-tight">
                        {item.judul}
                      </h3>
                      <p className="text-[#16161a]/60">
                        {item.penyelenggara} · {item.tahun}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal>
                <p className="serif text-xl italic text-[#16161a]/50">
                  Data pelatihan belum ditambahkan.
                </p>
              </Reveal>
            )}
          </div>
        </section>

        {/* KONTAK */}
        <section
          id="kontak"
          className="scroll-mt-20 bg-[#16161a] px-6 py-24 text-[#f3efe7] md:px-12"
        >
          <div className="mx-auto max-w-6xl text-center">
            <Reveal>
              <p className="mb-6 text-sm font-semibold tracking-widest uppercase">
                Mari Bekerja Sama
              </p>
            </Reveal>
            <Reveal delay={80}>
              <a
                href={profil.github}
                target="_blank"
                rel="noopener noreferrer"
                className="serif text-4xl font-medium italic transition hover:text-[#e0568a] md:text-7xl"
              >
                Lihat GitHub Saya ↗
              </a>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-8 max-w-xl text-[#f3efe7]/60">
                Silakan hubungi saya melalui GitHub untuk melihat berbagai proyek
                dan kode yang sudah saya buat.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden border-t-2 border-[#16161a] px-6 py-8 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <span className="text-sm text-[#16161a]/60">
            © 2026 Gede Pasek Ary Sugiantara
          </span>
          <span className="outline-text text-5xl font-extrabold tracking-tight md:text-7xl">
            Gede Pasek Ary
          </span>
        </div>
      </footer>
    </div>
  );
}
