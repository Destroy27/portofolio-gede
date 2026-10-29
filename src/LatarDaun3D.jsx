import { useEffect, useRef } from "react";
import * as THREE from "three";

// Tekstur daun prosedural dengan bentuk lonjong dan urat daun
function buatTeksturDaun() {
  const ukuran = 256;
  const kanvas = document.createElement("canvas");
  kanvas.width = ukuran;
  kanvas.height = ukuran;
  const ctx = kanvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, ukuran, ukuran);
  grad.addColorStop(0, "#22c55e");
  grad.addColorStop(0.5, "#16a34a");
  grad.addColorStop(1, "#15803d");
  ctx.fillStyle = grad;

  // Bentuk daun (lonjong/oval)
  ctx.beginPath();
  ctx.moveTo(ukuran / 2, 10);
  ctx.bezierCurveTo(ukuran - 10, 40, ukuran - 20, ukuran - 60, ukuran / 2, ukuran - 10);
  ctx.bezierCurveTo(20, ukuran - 60, 10, 40, ukuran / 2, 10);
  ctx.fill();

  // Urat daun (tulang daun)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ukuran / 2, 10);
  ctx.lineTo(ukuran / 2, ukuran - 10);
  ctx.stroke();

  // Urat daun menyamping
  for (let i = 0; i < 8; i++) {
    const y = 30 + i * 25;
    const xLeft = ukuran / 2 - 15 - i * 2;
    const xRight = ukuran / 2 + 15 + i * 2;
    ctx.beginPath();
    ctx.moveTo(ukuran / 2, y);
    ctx.lineTo(xLeft, y - 10);
    ctx.moveTo(ukuran / 2, y);
    ctx.lineTo(xRight, y - 10);
    ctx.stroke();
  }

  const tekstur = new THREE.CanvasTexture(kanvas);
  tekstur.transparent = true;
  return tekstur;
}

// Komponen Pohon Cemara HD (seperti Pohon Natal) untuk lanskap gunung salju
function PohonCemaraHD({ x, y, skala = 1, warnaPohon = "#0f3d2e" }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${skala})`}>
      {/* Batang pohon */}
      <rect x="-5" y="0" width="10" height="20" fill="#2d1a0e" rx="2" />
      {/* Tingkatan daun cemara (5 susun meruncing ke atas) */}
      <polygon points="0,-40 -34,8 34,8" fill={warnaPohon} />
      <polygon points="0,-65 -28,-12 28,-12" fill={warnaPohon} />
      <polygon points="0,-88 -22,-32 22,-32" fill={warnaPohon} />
      <polygon points="0,-108 -16,-52 16,-52" fill={warnaPohon} />
      <polygon points="0,-125 -10,-72 10,-72" fill={warnaPohon} />
      {/* Lapisan salju putih-biru di pucuk & ujung dahan cemara */}
      <polygon
        points="0,-125 -12,-105 -4,-108 0,-102 5,-107 12,-105"
        fill="#f0f9ff"
        opacity="0.95"
      />
      <polygon
        points="-22,-32 -12,-40 -6,-34 6,-34 12,-40 22,-32 14,-28 -14,-28"
        fill="#e0f2fe"
        opacity="0.85"
      />
      <polygon
        points="-28,-12 -15,-20 -8,-14 8,-14 15,-20 28,-12 20,-6 -20,-6"
        fill="#dbeafe"
        opacity="0.8"
      />
      <polygon
        points="-34,8 -18,0 -9,6 9,6 18,0 34,8 24,12 -24,12"
        fill="#bfdbfe"
        opacity="0.72"
      />
    </g>
  );
}

const pohonLapisBelakang = [
  { x: 60, y: 380, s: 0.55 },
  { x: 115, y: 375, s: 0.65 },
  { x: 180, y: 385, s: 0.5 },
  { x: 290, y: 382, s: 0.6 },
  { x: 400, y: 378, s: 0.55 },
  { x: 520, y: 388, s: 0.62 },
  { x: 660, y: 380, s: 0.58 },
  { x: 790, y: 386, s: 0.55 },
  { x: 930, y: 378, s: 0.68 },
  { x: 1060, y: 384, s: 0.6 },
  { x: 1190, y: 376, s: 0.65 },
  { x: 1320, y: 382, s: 0.58 },
];

const pohonLapisDepan = [
  { x: 30, y: 460, s: 0.95 },
  { x: 85, y: 468, s: 0.8 },
  { x: 150, y: 458, s: 1.05 },
  { x: 230, y: 470, s: 0.75 },
  { x: 340, y: 465, s: 0.9 },
  { x: 470, y: 472, s: 0.82 },
  { x: 600, y: 462, s: 1.0 },
  { x: 730, y: 468, s: 0.78 },
  { x: 870, y: 460, s: 1.08 },
  { x: 1000, y: 466, s: 0.85 },
  { x: 1130, y: 458, s: 0.98 },
  { x: 1260, y: 464, s: 0.88 },
  { x: 1370, y: 456, s: 1.05 },
];

export default function LatarDaun3D() {
  const wadahRef = useRef(null);
  const gunungJauhRef = useRef(null);
  const gunungDekatRef = useRef(null);
  const hutanDepanRef = useRef(null);

  useEffect(() => {
    const wadah = wadahRef.current;
    if (!wadah) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wadah.appendChild(renderer.domElement);

    // Pencahayaan lembut
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Tekstur daun
    const teksturDaun = buatTeksturDaun();

    // Material daun (double side, transparan)
    const materialDaun = new THREE.MeshStandardMaterial({
      map: teksturDaun,
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Geometri daun (plane tipis)
    const geometriDaun = new THREE.PlaneGeometry(0.8, 1.2);

    const jumlahDaun = 45;
    const daftarDaun = [];

    for (let i = 0; i < jumlahDaun; i++) {
      const mesh = new THREE.Mesh(geometriDaun, materialDaun);
      
      // Posisi acak di layar
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10
      );
      
      // Rotasi acak
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Skala acak
      const skala = 0.6 + Math.random() * 0.8;
      mesh.scale.set(skala, skala, skala);
      
      scene.add(mesh);
      
      daftarDaun.push({
        mesh,
        kecepatanY: 0.3 + Math.random() * 0.6,
        ayunanX: 0.4 + Math.random() * 0.8,
        frekuensi: 0.8 + Math.random() * 1.2,
        fase: Math.random() * Math.PI * 2,
        rotasiKecepatan: (Math.random() - 0.5) * 1.5,
      });
    }

    // Pelacakan Scroll & Kursor
    let targetScroll = 0;
    let currentScroll = 0;
    let targetKursor = { x: 0, y: 0 };
    let currentKursor = { x: 0, y: 0 };

    const saatScroll = () => {
      const tinggiMaks = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      targetScroll = Math.min(1, Math.max(0, window.scrollY / tinggiMaks));
    };

    const saatGerakKursor = (e) => {
      targetKursor.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetKursor.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const saatResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    saatScroll();
    window.addEventListener("scroll", saatScroll, { passive: true });
    window.addEventListener("mousemove", saatGerakKursor, { passive: true });
    window.addEventListener("resize", saatResize);

    let frameId;
    let waktuTerakhir = performance.now();

    const animasikan = (waktuSekarang) => {
      const dt = Math.min((waktuSekarang - waktuTerakhir) / 1000, 0.05);
      waktuTerakhir = waktuSekarang;
      const t = waktuSekarang * 0.001;

      currentScroll += (targetScroll - currentScroll) * Math.min(1, dt * 4.2);
      currentKursor.x +=
        (targetKursor.x - currentKursor.x) * Math.min(1, dt * 3.5);
      currentKursor.y +=
        (targetKursor.y - currentKursor.y) * Math.min(1, dt * 3.5);

      // Animasi daun
      for (let i = 0; i < jumlahDaun; i++) {
        const daun = daftarDaun[i];
        const m = daun.mesh;
        
        // Daun turun perlahan
        m.position.y -= daun.kecepatanY * dt;
        
        // Ayunan ke samping (sway)
        m.position.x += Math.sin(t * daun.frekuensi + daun.fase) * daun.ayunanX * dt;
        
        // Rotasi 3D
        m.rotation.x += daun.rotasiKecepatan * dt;
        m.rotation.y += daun.rotasiKecepatan * 0.7 * dt;
        m.rotation.z += daun.rotasiKecepatan * 0.3 * dt;
        
        // Efek paralaks kursor
        m.position.x += currentKursor.x * 0.02;
        m.position.y += currentKursor.y * 0.01;
        
        // Reset daun yang lewat bawah
        if (m.position.y < -8) {
          m.position.y = 8;
          m.position.x = (Math.random() - 0.5) * 22;
          m.position.z = (Math.random() - 0.5) * 10;
          m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        }
      }

      // Paralaks pegunungan salju & hutan cemara
      if (gunungJauhRef.current) {
        gunungJauhRef.current.style.transform = `translate3d(${(currentKursor.x * -10).toFixed(1)}px, ${(currentScroll * 22).toFixed(1)}px, 0)`;
      }
      if (gunungDekatRef.current) {
        gunungDekatRef.current.style.transform = `translate3d(${(currentKursor.x * -18).toFixed(1)}px, ${(currentScroll * 12).toFixed(1)}px, 0)`;
      }
      if (hutanDepanRef.current) {
        hutanDepanRef.current.style.transform = `translate3d(${(currentKursor.x * -26).toFixed(1)}px, 0px, 0)`;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animasikan);
    };

    frameId = requestAnimationFrame(animasikan);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", saatScroll);
      window.removeEventListener("mousemove", saatGerakKursor);
      window.removeEventListener("resize", saatResize);
      if (renderer.domElement && wadah.contains(renderer.domElement)) {
        wadah.removeChild(renderer.domElement);
      }
      geometriDaun.dispose();
      materialDaun.dispose();
      teksturDaun.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Kanvas WebGL 3D: Daun yang jatuh */}
      <div ref={wadahRef} className="absolute inset-0" />

      {/* Lanskap Pegunungan Salju & Pepohonan Cemara (seperti Pohon Natal) di bagian bawah */}
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[48vh] w-full sm:h-[54vh]"
      >
        <defs>
          <linearGradient id="gradGunungJauh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8c5e8" />
            <stop offset="55%" stopColor="#6b93c8" />
            <stop offset="100%" stopColor="#3a5f94" />
          </linearGradient>
          <linearGradient id="gradGunungDekat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ca8dc" />
            <stop offset="60%" stopColor="#4a7ab8" />
            <stop offset="100%" stopColor="#2a4f7a" />
          </linearGradient>
          <linearGradient id="gradSaljuPuncak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradLembahSalju" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8dce8" />
            <stop offset="100%" stopColor="#8fb4d8" />
          </linearGradient>
        </defs>

        {/* Lapis 1: Pegunungan Salju Jauh */}
        <g ref={gunungJauhRef}>
          <polygon
            points="-60,520 140,190 340,370 560,130 790,350 1040,155 1290,340 1500,180 1500,520"
            fill="url(#gradGunungJauh)"
          />
          {/* Tudung Salju di Puncak Gunung Jauh */}
          <polygon
            points="140,190 85,270 118,258 140,282 168,255 198,272"
            fill="url(#gradSaljuPuncak)"
          />
          <polygon
            points="560,130 485,245 528,225 560,260 595,222 640,248"
            fill="url(#gradSaljuPuncak)"
          />
          <polygon
            points="1040,155 968,262 1012,240 1042,272 1075,238 1118,262"
            fill="url(#gradSaljuPuncak)"
          />
        </g>

        {/* Lapis 2: Pegunungan Salju Tengah & Pepohonan Cemara Belakang */}
        <g ref={gunungDekatRef}>
          <polygon
            points="-40,520 60,310 290,220 490,390 740,205 970,385 1190,235 1480,390 1480,520"
            fill="url(#gradGunungDekat)"
          />
          {/* Tudung Salju Puncak Gunung Tengah */}
          <polygon
            points="290,220 225,305 262,288 290,318 320,285 358,308"
            fill="url(#gradSaljuPuncak)"
          />
          <polygon
            points="740,205 670,300 710,278 742,312 775,276 815,302"
            fill="url(#gradSaljuPuncak)"
          />
          <polygon
            points="1190,235 1125,318 1162,298 1192,326 1222,296 1260,320"
            fill="url(#gradSaljuPuncak)"
          />

          {/* Bukit Salju & Pepohonan Cemara Lapis Belakang */}
          <path
            d="M-40,435 Q360,395 720,428 T1480,420 L1480,520 L-40,520 Z"
            fill="url(#gradLembahSalju)"
          />
          {pohonLapisBelakang.map((p, idx) => (
            <PohonCemaraHD
              key={`b-${idx}`}
              x={p.x}
              y={p.y}
              skala={p.s}
              warnaPohon="#1a4a3a"
            />
          ))}
        </g>

        {/* Lapis 3: Hamparan Salju Depan & Hutan Pohon Cemara (Pohon Natal) */}
        <g ref={hutanDepanRef}>
          <path
            d="M-40,468 Q280,438 680,465 T1480,455 L1480,520 L-40,520 Z"
            fill="#d8e8f0"
          />
          {/* Garis salju berkilau di punggung bukit */}
          <path
            d="M-40,468 Q280,438 680,465 T1480,455"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeOpacity="0.6"
          />
          {pohonLapisDepan.map((p, idx) => (
            <PohonCemaraHD
              key={`f-${idx}`}
              x={p.x}
              y={p.y}
              skala={p.s}
              warnaPohon="#0f3d2e"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
