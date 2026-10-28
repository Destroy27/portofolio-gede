import { useState } from "react";
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

function Navigasi({ onPilih }) {
  return (
    <nav className="flex flex-col gap-1">
      {menu.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onPilih}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium tracking-wider text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <span className="h-px w-4 bg-zinc-600 transition-all group-hover:w-8 group-hover:bg-pink-300" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function Bagian({ id, judul, children }) {
  return (
    <section id={id} className="scroll-mt-24 px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-sm font-semibold tracking-[0.3em] text-pink-200 uppercase">
          {judul}
        </h2>
        {children}
      </div>
    </section>
  );
}

const kartuKaca =
  "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl";

export default function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-emerald-200/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-300/10 blur-3xl" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:flex">
        <div>
          <a href="#top" className="text-xl font-bold">
            Gede<span className="text-pink-300">.</span>
          </a>
          <p className="mt-2 text-xs text-zinc-500">{profil.peran}</p>
          <div className="mt-12">
            <Navigasi />
          </div>
        </div>
        <a
          href={profil.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          GitHub
        </a>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-zinc-950/80 px-6 py-4 backdrop-blur-xl lg:hidden">
        <a href="#top" className="text-lg font-bold">
          Gede<span className="text-pink-300">.</span>
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
          <div className="absolute inset-x-0 top-full border-b border-white/10 bg-zinc-950/95 p-6 backdrop-blur-xl">
            <Navigasi onPilih={() => setMenuTerbuka(false)} />
          </div>
        )}
      </header>

      <main className="relative lg:pl-64">
        <section
          id="top"
          className="flex min-h-screen items-center px-6 pt-28 pb-16 lg:px-16 lg:pt-0"
        >
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 text-sm text-pink-200">Halo, saya</p>
              <h1 className="text-4xl leading-tight font-extrabold sm:text-6xl">
                {profil.nama}
              </h1>
              <p className="mt-4 text-lg font-medium text-zinc-300">
                {profil.peran}
              </p>
              <p className="mt-6 max-w-lg leading-relaxed text-zinc-400">
                {profil.ringkas}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#work"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-pink-100"
                >
                  Lihat Proyek
                </a>
                <a
                  href="#kontak"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/5"
                >
                  Hubungi Saya
                </a>
              </div>
            </div>

            <div
              className={`mx-auto w-full max-w-sm p-3 shadow-2xl shadow-black/40 ${kartuKaca}`}
            >
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
            {proyek.map((item) => (
              <a
                key={item.judul}
                href={item.link}
                className={`group p-8 transition hover:-translate-y-1 hover:border-pink-200/40 hover:bg-white/10 ${kartuKaca}`}
              >
                <span className="text-sm font-semibold text-zinc-500">
                  {item.nomor}
                </span>
                <h3 className="mt-6 text-2xl font-bold">{item.judul}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  {item.deskripsi}
                </p>
                <p className="mt-8 text-sm font-semibold text-pink-200 group-hover:underline">
                  Kunjungi Website →
                </p>
              </a>
            ))}
          </div>
        </Bagian>

        <Bagian id="keahlian" judul="What I Can Do">
          <div className="flex flex-wrap gap-3">
            {keahlian.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm backdrop-blur-xl transition hover:border-emerald-200/40 hover:text-emerald-100"
              >
                {item}
              </span>
            ))}
          </div>
        </Bagian>

        <Bagian id="about" judul="About">
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-zinc-400">
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
                className={`flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center ${kartuKaca}`}
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pink-200 text-2xl font-extrabold text-zinc-950">
                  {item.peringkat}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.judul}</h3>
                  <p className="mt-1 leading-relaxed text-zinc-400">
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
                <article key={item.judul} className={`p-8 ${kartuKaca}`}>
                  <h3 className="text-xl font-bold">{item.judul}</h3>
                  <p className="mt-1 text-zinc-400">
                    {item.penyelenggara} · {item.tahun}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">Data pelatihan belum ditambahkan.</p>
          )}
        </Bagian>

        <Bagian id="kontak" judul="Contact">
          <div className={`p-10 text-center ${kartuKaca}`}>
            <p className="mx-auto max-w-xl leading-relaxed text-zinc-400">
              Silakan hubungi saya melalui GitHub untuk melihat berbagai proyek
              dan kode yang sudah saya buat.
            </p>
            <a
              href={profil.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-pink-100"
            >
              Kunjungi GitHub
            </a>
          </div>
        </Bagian>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500 lg:pl-64">
        © 2026 Gede Pasek Ary Sugiantara
      </footer>
    </div>
  );
}
