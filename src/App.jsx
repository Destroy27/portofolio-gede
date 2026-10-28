import { useCallback, useEffect, useRef, useState } from "react";
import {
  profil,
  proyek,
  keahlian,
  penghargaan,
  pelatihan,
} from "./data.js";

const menu = [
  { label: "WORK", href: "#work" },
  { label: "WHAT I CAN DO", href: "#keahlian" },
  { label: "ABOUT", href: "#about" },
  { label: "AWARDS", href: "#awards" },
  { label: "TRAININGS", href: "#trainings" },
];

const warnaProyek = ["bg-pink-100", "bg-teal-100"];
const JUMLAH_KARTU_LOADER = 14;

function Loader({ onSelesai }) {
  const [keluar, setKeluar] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setKeluar(true), 2200);
    const b = setTimeout(onSelesai, 2800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onSelesai]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#13193b] text-[#f8f9f9] transition-opacity duration-500 ${
        keluar ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Memuat portofolio"
    >
      <div className="relative h-24 w-24 animate-[spin_12s_linear_infinite]">
        {Array.from({ length: JUMLAH_KARTU_LOADER }).map((_, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 h-3 w-3 rounded-sm bg-[#f8f9f9]"
            style={{
              transform: `translate(-50%, -50%) rotate(${
                (i * 360) / JUMLAH_KARTU_LOADER
              }deg) translateY(-40px)`,
              animation: `loader-dot 2.4s ease-in-out ${
                -(i * 0.17)
              }s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-lg font-medium tracking-wider">Loading...</p>
    </div>
  );
}

function Reveal({ children, className = "" }) {
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
    >
      {children}
    </div>
  );
}

function Navigasi({ onPilih }) {
  return (
    <nav className="flex flex-col gap-1">
      {menu.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onPilih}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium tracking-wider text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <span className="h-px w-4 bg-white/30 transition-all group-hover:w-8 group-hover:bg-pink-200" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function Bagian({ id, judul, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-[#f4f4f1] px-6 py-24 text-[#13193b] lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-12 inline-flex flex-col text-sm font-semibold tracking-[0.3em] uppercase">
            {judul}
            <span className="mt-3 h-1 w-12 rounded-full bg-pink-300" />
          </h2>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

const kartuPutih =
  "rounded-3xl bg-white shadow-sm ring-1 ring-black/5";

export default function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [memuat, setMemuat] = useState(true);
  const selesaiMemuat = useCallback(() => setMemuat(false), []);

  return (
    <div className="min-h-screen bg-[#f4f4f1] font-sans text-[#13193b] antialiased">
      {memuat && <Loader onSelesai={selesaiMemuat} />}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-white/10 bg-[#13193b] p-8 text-white lg:flex">
        <div>
          <a href="#top" className="text-xl font-bold">
            Gede<span className="text-pink-200">.</span>
          </a>
          <p className="mt-2 text-xs text-white/50">{profil.peran}</p>
          <div className="mt-12">
            <Navigasi />
          </div>
        </div>
        <a
          href={profil.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/60 transition hover:text-white"
        >
          GitHub
        </a>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-[#13193b] px-6 py-4 text-white lg:hidden">
        <a href="#top" className="text-lg font-bold">
          Gede<span className="text-pink-200">.</span>
        </a>
        <button
          type="button"
          onClick={() => setMenuTerbuka(!menuTerbuka)}
          aria-expanded={menuTerbuka}
          aria-label="Buka menu"
          className="flex flex-col gap-1.5 p-1"
        >
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
        </button>
        {menuTerbuka && (
          <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[#13193b] p-6">
            <Navigasi onPilih={() => setMenuTerbuka(false)} />
          </div>
        )}
      </header>

      <main className="relative lg:pl-64">
        <section
          id="top"
          className="hero-bg relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 text-white lg:px-16 lg:pt-0"
        >
          <div className="pointer-events-none absolute inset-6 border border-white/10 lg:inset-16" />
          <div className="relative mx-auto grid w-full max-w-5xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 text-sm font-medium text-pink-200">Halo, saya</p>
              <h1 className="text-4xl leading-tight font-extrabold sm:text-6xl">
                {profil.nama}
              </h1>
              <p className="mt-4 text-lg font-medium text-white/80">
                {profil.peran}
              </p>
              <p className="mt-6 max-w-lg leading-relaxed text-white/60">
                {profil.ringkas}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#work"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#13193b] transition hover:-translate-y-0.5 hover:bg-pink-100"
                >
                  Lihat Proyek
                </a>
                <a
                  href="#kontak"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Hubungi Saya
                </a>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-white/10 p-3 shadow-2xl shadow-black/30 ring-1 ring-white/20 backdrop-blur-xl">
              <img
                src={profil.foto}
                alt={profil.nama}
                className="aspect-square w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </section>

        <Bagian id="work" judul="Work">
          <div className="grid gap-6 md:grid-cols-2">
            {proyek.map((item, i) => (
              <a
                key={item.judul}
                href={item.link}
                className={`group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl ${kartuPutih}`}
              >
                <div
                  className={`flex h-48 items-end justify-between p-6 ${warnaProyek[i % warnaProyek.length]}`}
                >
                  <span className="text-6xl font-extrabold text-[#13193b]/15">
                    {item.nomor}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold">{item.judul}</h3>
                  <p className="mt-3 leading-relaxed text-[#13193b]/60">
                    {item.deskripsi}
                  </p>
                  <p className="mt-8 text-sm font-semibold group-hover:underline">
                    Kunjungi Website →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Bagian>

        <Bagian id="keahlian" judul="What I Can Do">
          <div className="flex flex-wrap gap-3">
            {keahlian.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-teal-50"
              >
                {item}
              </span>
            ))}
          </div>
        </Bagian>

        <Bagian id="about" judul="About">
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-[#13193b]/70">
            {profil.tentang.map((paragraf) => (
              <p key={paragraf}>{paragraf}</p>
            ))}
          </div>
        </Bagian>

        <Bagian id="awards" judul="Awards">
          <div className="grid gap-6">
            {penghargaan.map((item) => (
              <article
                key={item.judul}
                className="flex flex-col items-start gap-6 rounded-3xl bg-[#13193b] p-8 text-white sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pink-200 text-2xl font-extrabold text-[#13193b]">
                  {item.peringkat}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.judul}</h3>
                  <p className="mt-1 leading-relaxed text-white/60">
                    {item.keterangan}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Bagian>

        <Bagian id="trainings" judul="Trainings">
          {pelatihan.length > 0 ? (
            <div className="grid gap-6">
              {pelatihan.map((item) => (
                <article key={item.judul} className={`p-8 ${kartuPutih}`}>
                  <h3 className="text-xl font-bold">{item.judul}</h3>
                  <p className="mt-1 text-[#13193b]/60">
                    {item.penyelenggara} · {item.tahun}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[#13193b]/50">
              Data pelatihan belum ditambahkan.
            </p>
          )}
        </Bagian>

        <Bagian id="kontak" judul="Contact">
          <div className={`p-10 text-center ${kartuPutih}`}>
            <p className="mx-auto max-w-xl leading-relaxed text-[#13193b]/70">
              Silakan hubungi saya melalui GitHub untuk melihat berbagai proyek
              dan kode yang sudah saya buat.
            </p>
            <a
              href={profil.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-[#13193b] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1f2857]"
            >
              Kunjungi GitHub
            </a>
          </div>
        </Bagian>
      </main>

      <footer className="bg-[#13193b] px-6 py-8 text-center text-sm text-white/50 lg:pl-64">
        © 2026 Gede Pasek Ary Sugiantara
      </footer>
    </div>
  );
}
