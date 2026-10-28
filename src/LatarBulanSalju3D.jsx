import { useEffect, useRef } from "react";
import * as THREE from "three";

// Tekstur kawah Bulan 3D
function buatTeksturBulan() {
  const lebar = 1024;
  const tinggi = 512;
  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const ctx = kanvas.getContext("2d");

  const gradDasar = ctx.createLinearGradient(0, 0, 0, tinggi);
  gradDasar.addColorStop(0, "#d8dde6");
  gradDasar.addColorStop(0.5, "#f1f5f9");
  gradDasar.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = gradDasar;
  ctx.fillRect(0, 0, lebar, tinggi);

  let seed = 42;
  const acak = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < 18; i++) {
    const x = acak() * lebar;
    const y = (0.15 + acak() * 0.7) * tinggi;
    const r = 45 + acak() * 110;
    const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
    grad.addColorStop(0, "rgba(120, 132, 152, 0.45)");
    grad.addColorStop(0.6, "rgba(142, 154, 172, 0.24)");
    grad.addColorStop(1, "rgba(148, 158, 175, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 260; i++) {
    const x = acak() * lebar;
    const y = acak() * tinggi;
    const r = 3 + Math.pow(acak(), 3) * 38;

    const rim = ctx.createRadialGradient(x, y, r * 0.65, x, y, r * 1.15);
    rim.addColorStop(0, "rgba(255, 255, 255, 0)");
    rim.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
    rim.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.15, 0, Math.PI * 2);
    ctx.fill();

    const cekung = ctx.createRadialGradient(
      x - r * 0.15,
      y - r * 0.15,
      r * 0.05,
      x,
      y,
      r * 0.85,
    );
    cekung.addColorStop(0, "rgba(100, 112, 132, 0.58)");
    cekung.addColorStop(0.75, "rgba(135, 146, 165, 0.35)");
    cekung.addColorStop(1, "rgba(220, 226, 236, 0)");
    ctx.fillStyle = cekung;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  const tekstur = new THREE.CanvasTexture(kanvas);
  tekstur.wrapS = THREE.RepeatWrapping;
  tekstur.wrapT = THREE.ClampToEdgeWrapping;
  return tekstur;
}

// Tekstur Planet Bercincin (Gas Giant seperti Saturnus)
function buatTeksturPlanetGas() {
  const lebar = 512;
  const tinggi = 256;
  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const ctx = kanvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, tinggi);
  grad.addColorStop(0, "#7c2d12");
  grad.addColorStop(0.18, "#d97706");
  grad.addColorStop(0.32, "#fde68a");
  grad.addColorStop(0.48, "#b45309");
  grad.addColorStop(0.62, "#f59e0b");
  grad.addColorStop(0.78, "#fbbf24");
  grad.addColorStop(1, "#78350f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, lebar, tinggi);

  // Sabuk badai halus
  for (let i = 0; i < 40; i++) {
    const y = (i / 40) * tinggi;
    ctx.fillStyle =
      i % 2 === 0 ? "rgba(255, 251, 235, 0.12)" : "rgba(69, 26, 3, 0.14)";
    ctx.fillRect(0, y, lebar, 3);
  }

  return new THREE.CanvasTexture(kanvas);
}

// Tekstur Cincin Planet Saturnus
function buatTeksturCincinPlanet() {
  const ukuran = 512;
  const kanvas = document.createElement("canvas");
  kanvas.width = ukuran;
  kanvas.height = ukuran;
  const ctx = kanvas.getContext("2d");
  const pusat = ukuran / 2;

  const grad = ctx.createRadialGradient(
    pusat,
    pusat,
    ukuran * 0.22,
    pusat,
    pusat,
    ukuran * 0.49,
  );
  grad.addColorStop(0, "rgba(253, 230, 138, 0)");
  grad.addColorStop(0.15, "rgba(253, 230, 138, 0.65)");
  grad.addColorStop(0.38, "rgba(245, 158, 11, 0.45)");
  grad.addColorStop(0.45, "rgba(0, 0, 0, 0.05)"); // Celah Cassini
  grad.addColorStop(0.55, "rgba(254, 243, 199, 0.75)");
  grad.addColorStop(0.82, "rgba(217, 119, 6, 0.35)");
  grad.addColorStop(1, "rgba(217, 119, 6, 0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(pusat, pusat, ukuran * 0.49, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(kanvas);
}

// Tekstur Planet Es Biru-Ungu (Neptunus / Uranus)
function buatTeksturPlanetEs() {
  const lebar = 512;
  const tinggi = 256;
  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const ctx = kanvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, tinggi);
  grad.addColorStop(0, "#1e1b4b");
  grad.addColorStop(0.28, "#0284c7");
  grad.addColorStop(0.52, "#38bdf8");
  grad.addColorStop(0.75, "#6366f1");
  grad.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, lebar, tinggi);

  return new THREE.CanvasTexture(kanvas);
}

// Tekstur titik bintang berkilau
function buatTeksturBintang() {
  const kanvas = document.createElement("canvas");
  kanvas.width = 64;
  kanvas.height = 64;
  const ctx = kanvas.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 1, 32, 32, 30);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.25, "rgba(224, 242, 254, 0.9)");
  grad.addColorStop(0.6, "rgba(186, 230, 253, 0.25)");
  grad.addColorStop(1, "rgba(186, 230, 253, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(kanvas);
}

// Tekstur jejak ekor meteor / bintang jatuh
function buatTeksturMeteor() {
  const kanvas = document.createElement("canvas");
  kanvas.width = 256;
  kanvas.height = 32;
  const ctx = kanvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 16, 256, 16);
  grad.addColorStop(0, "rgba(56, 189, 248, 0)");
  grad.addColorStop(0.55, "rgba(186, 230, 253, 0.45)");
  grad.addColorStop(0.9, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(1, "rgba(255, 255, 255, 1)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(128, 16, 126, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(kanvas);
}

// Tekstur pendaran cahaya (halo) Bulan
function buatTeksturHalo() {
  const kanvas = document.createElement("canvas");
  kanvas.width = 256;
  kanvas.height = 256;
  const ctx = kanvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
  grad.addColorStop(0, "rgba(224, 242, 254, 0.65)");
  grad.addColorStop(0.38, "rgba(186, 230, 253, 0.3)");
  grad.addColorStop(0.72, "rgba(125, 211, 252, 0.08)");
  grad.addColorStop(1, "rgba(125, 211, 252, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(kanvas);
}

// Komponen Pohon Cemara Bersalju (seperti Pohon Natal) untuk lanskap gunung salju
function PohonCemaraSalju({ x, y, skala = 1, warnaPohon = "#0c1f38" }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${skala})`}>
      {/* Batang pohon */}
      <rect x="-4" y="0" width="8" height="16" fill="#071120" />
      {/* Tingkatan daun cemara (3 susun meruncing ke atas) */}
      <polygon points="0,-32 -28,2 28,2" fill={warnaPohon} />
      <polygon points="0,-56 -22,-20 22,-20" fill={warnaPohon} />
      <polygon points="0,-78 -16,-44 16,-44" fill={warnaPohon} />
      {/* Lapisan salju putih-biru di pucuk & ujung dahan cemara */}
      <polygon
        points="0,-78 -9,-60 -3,-63 0,-58 4,-62 9,-60"
        fill="#e0f2fe"
        opacity="0.92"
      />
      <polygon
        points="-22,-20 -11,-26 -6,-21 6,-21 11,-26 22,-20 14,-17 -14,-17"
        fill="#dbeafe"
        opacity="0.82"
      />
      <polygon
        points="-28,2 -15,-5 -7,0 7,0 15,-5 28,2 18,4 -18,4"
        fill="#bfdbfe"
        opacity="0.75"
      />
    </g>
  );
}

const pohonLapisBelakang = [
  { x: 70, y: 428, s: 0.65 },
  { x: 125, y: 422, s: 0.8 },
  { x: 195, y: 432, s: 0.6 },
  { x: 310, y: 430, s: 0.72 },
  { x: 420, y: 425, s: 0.68 },
  { x: 540, y: 434, s: 0.75 },
  { x: 690, y: 426, s: 0.7 },
  { x: 820, y: 432, s: 0.65 },
  { x: 960, y: 424, s: 0.82 },
  { x: 1090, y: 430, s: 0.7 },
  { x: 1230, y: 422, s: 0.76 },
  { x: 1355, y: 428, s: 0.68 },
];

const pohonLapisDepan = [
  { x: 35, y: 468, s: 1.15 },
  { x: 95, y: 474, s: 0.92 },
  { x: 160, y: 465, s: 1.25 },
  { x: 240, y: 476, s: 0.88 },
  { x: 355, y: 472, s: 1.08 },
  { x: 485, y: 478, s: 0.95 },
  { x: 615, y: 470, s: 1.18 },
  { x: 745, y: 476, s: 0.9 },
  { x: 885, y: 468, s: 1.22 },
  { x: 1015, y: 475, s: 0.96 },
  { x: 1145, y: 466, s: 1.14 },
  { x: 1280, y: 472, s: 1.05 },
  { x: 1390, y: 464, s: 1.2 },
];

export default function LatarBulanSalju3D() {
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
      120,
    );
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wadah.appendChild(renderer.domElement);

    // Pencahayaan ruang angkasa
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.72);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    sunLight.position.set(7, 5, 8);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 30);
    rimLight.position.set(-7, -2, 4);
    scene.add(rimLight);

    // 1. OBJEK BULAN 3D UTAMA (Di atas pegunungan salju)
    const grupBulan = new THREE.Group();
    scene.add(grupBulan);

    const teksturBulan = buatTeksturBulan();
    const geometriBulan = new THREE.SphereGeometry(1.55, 64, 64);
    const materialBulan = new THREE.MeshStandardMaterial({
      map: teksturBulan,
      bumpMap: teksturBulan,
      bumpScale: 0.065,
      roughness: 0.76,
      metalness: 0.08,
      emissive: new THREE.Color(0x1e293b),
      emissiveIntensity: 0.22,
    });
    const meshBulan = new THREE.Mesh(geometriBulan, materialBulan);
    grupBulan.add(meshBulan);

    const teksturHalo = buatTeksturHalo();
    const materialHalo = new THREE.SpriteMaterial({
      map: teksturHalo,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const spriteHalo = new THREE.Sprite(materialHalo);
    spriteHalo.scale.set(6.5, 6.5, 1);
    grupBulan.add(spriteHalo);

    // 2. PLANET BERCINCIN 3D (Gas Giant seperti Saturnus)
    const grupPlanetGas = new THREE.Group();
    scene.add(grupPlanetGas);

    const teksturPlanetGas = buatTeksturPlanetGas();
    const geometriPlanetGas = new THREE.SphereGeometry(0.88, 48, 48);
    const materialPlanetGas = new THREE.MeshStandardMaterial({
      map: teksturPlanetGas,
      roughness: 0.65,
      metalness: 0.1,
      emissive: new THREE.Color(0x451a03),
      emissiveIntensity: 0.2,
    });
    const meshPlanetGas = new THREE.Mesh(geometriPlanetGas, materialPlanetGas);
    grupPlanetGas.add(meshPlanetGas);

    const teksturCincin = buatTeksturCincinPlanet();
    const geometriCincin = new THREE.PlaneGeometry(3.8, 3.8);
    const materialCincin = new THREE.MeshBasicMaterial({
      map: teksturCincin,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const meshCincinPlanet = new THREE.Mesh(geometriCincin, materialCincin);
    meshCincinPlanet.rotation.x = Math.PI * 0.42;
    meshCincinPlanet.rotation.y = -Math.PI * 0.12;
    grupPlanetGas.add(meshCincinPlanet);

    // 3. PLANET ES BIRU 3D (Neptunus / Ice Giant di kejauhan)
    const grupPlanetEs = new THREE.Group();
    scene.add(grupPlanetEs);

    const teksturPlanetEs = buatTeksturPlanetEs();
    const geometriPlanetEs = new THREE.SphereGeometry(0.52, 36, 36);
    const materialPlanetEs = new THREE.MeshStandardMaterial({
      map: teksturPlanetEs,
      roughness: 0.5,
      emissive: new THREE.Color(0x0369a1),
      emissiveIntensity: 0.35,
    });
    const meshPlanetEs = new THREE.Mesh(geometriPlanetEs, materialPlanetEs);
    grupPlanetEs.add(meshPlanetEs);

    const haloEs = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: teksturHalo,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    haloEs.scale.set(2.3, 2.3, 1);
    grupPlanetEs.add(haloEs);

    // 4. BINTANG-BINTANG 3D DI LANGIT MALAM (Menggantikan partikel salju)
    const jumlahBintang = 680;
    const posisiBintang = new Float32Array(jumlahBintang * 3);
    const warnaBintang = new Float32Array(jumlahBintang * 3);

    const paletWarnaBintang = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#bae6fd"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#e0e7ff"),
      new THREE.Color("#fbcfe8"),
    ];

    for (let i = 0; i < jumlahBintang; i++) {
      posisiBintang[i * 3] = (Math.random() - 0.5) * 32;
      posisiBintang[i * 3 + 1] = -2 + Math.random() * 14; // Di langit atas pegunungan
      posisiBintang[i * 3 + 2] = -12 + Math.random() * 10;

      const c =
        paletWarnaBintang[Math.floor(Math.random() * paletWarnaBintang.length)];
      warnaBintang[i * 3] = c.r;
      warnaBintang[i * 3 + 1] = c.g;
      warnaBintang[i * 3 + 2] = c.b;
    }

    const geometriBintang = new THREE.BufferGeometry();
    geometriBintang.setAttribute(
      "position",
      new THREE.BufferAttribute(posisiBintang, 3),
    );
    geometriBintang.setAttribute(
      "color",
      new THREE.BufferAttribute(warnaBintang, 3),
    );

    const teksturBintang = buatTeksturBintang();
    const materialBintang = new THREE.PointsMaterial({
      size: 0.22,
      map: teksturBintang,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const sistemBintang = new THREE.Points(geometriBintang, materialBintang);
    scene.add(sistemBintang);

    // 5. BINTANG JATUH / METEOR 3D
    const teksturMeteor = buatTeksturMeteor();
    const daftarMeteor = [];
    const jumlahMeteor = 4;

    const resetMeteor = (m, tAwal = false) => {
      m.aktif = !tAwal && Math.random() < 0.65;
      m.jeda = tAwal ? Math.random() * 2.5 : 0.8 + Math.random() * 3.5;
      m.x = -4 + Math.random() * 16;
      m.y = 3.5 + Math.random() * 4.5;
      m.z = -4 + Math.random() * 2;
      const sudutJatuh = -Math.PI * (0.18 + Math.random() * 0.12);
      const laju = 11 + Math.random() * 6;
      m.vx = -Math.cos(sudutJatuh) * laju;
      m.vy = Math.sin(sudutJatuh) * laju;
      m.mesh.rotation.z = Math.PI + sudutJatuh;
      m.umur = 0;
      m.umurMaks = 0.75 + Math.random() * 0.55;
      m.material.opacity = 0;
    };

    for (let i = 0; i < jumlahMeteor; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: teksturMeteor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const geo = new THREE.PlaneGeometry(2.6, 0.14);
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const objekMeteor = {
        mesh,
        material: mat,
        geometri: geo,
        aktif: false,
        jeda: i * 1.2,
        x: 0,
        y: 0,
        z: -3,
        vx: 0,
        vy: 0,
        umur: 0,
        umurMaks: 1,
      };
      resetMeteor(objekMeteor, true);
      daftarMeteor.push(objekMeteor);
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

      const mobile = window.innerWidth < 768;

      // Animasi Bulan 3D di atas pegunungan salju saat halaman di-scroll
      grupBulan.scale.setScalar(mobile ? 0.65 : 0.95);
      const bulanX =
        Math.cos(currentScroll * Math.PI * 1.4) * (mobile ? 1.8 : 3.8) +
        currentKursor.x * 0.4;
      const bulanY =
        2.35 -
        currentScroll * 1.35 +
        Math.sin(t * 0.6) * 0.14 +
        currentKursor.y * 0.25;
      const bulanZ = -1.2 + Math.sin(currentScroll * Math.PI) * 1.1;
      grupBulan.position.set(bulanX, bulanY, bulanZ);
      meshBulan.rotation.y = t * 0.15 + currentScroll * Math.PI * 2.2;
      meshBulan.rotation.x = 0.12 + Math.sin(currentScroll * Math.PI) * 0.25;

      // Animasi Planet Bercincin (Saturnus) di sisi berlawanan
      grupPlanetGas.scale.setScalar(mobile ? 0.6 : 0.92);
      const gasX =
        -Math.cos(currentScroll * Math.PI * 1.3) * (mobile ? 2.1 : 4.6) +
        currentKursor.x * 0.28;
      const gasY =
        1.1 +
        Math.sin(currentScroll * Math.PI * 1.2) * 1.4 +
        Math.cos(t * 0.5) * 0.12 +
        currentKursor.y * 0.2;
      grupPlanetGas.position.set(gasX, gasY, -3.2);
      meshPlanetGas.rotation.y = -t * 0.22 - currentScroll * Math.PI * 1.8;
      meshCincinPlanet.rotation.z = t * 0.08 + currentScroll * 0.8;

      // Animasi Planet Es Biru di langit tinggi
      grupPlanetEs.scale.setScalar(mobile ? 0.55 : 0.85);
      const esX =
        -1.5 +
        Math.sin(currentScroll * Math.PI * 2) * (mobile ? 1.5 : 3.2) +
        currentKursor.x * 0.18;
      const esY = 3.1 - currentScroll * 0.9 + Math.sin(t * 0.8) * 0.1;
      grupPlanetEs.position.set(esX, esY, -5.0);
      meshPlanetEs.rotation.y = t * 0.3 + currentScroll * Math.PI;

      // Kedipan & paralaks Bintang 3D
      sistemBintang.rotation.y =
        currentKursor.x * 0.05 + currentScroll * 0.18;
      sistemBintang.rotation.x = -currentKursor.y * 0.03;
      materialBintang.opacity = 0.78 + Math.sin(t * 2.2) * 0.16;

      // Animasi Meteor / Bintang Jatuh
      for (let i = 0; i < jumlahMeteor; i++) {
        const m = daftarMeteor[i];
        if (!m.aktif) {
          m.jeda -= dt;
          if (m.jeda <= 0) {
            m.aktif = true;
            m.umur = 0;
          }
          continue;
        }

        m.umur += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.mesh.position.set(m.x, m.y, m.z);

        const progres = m.umur / m.umurMaks;
        if (progres >= 1) {
          resetMeteor(m, false);
        } else {
          // Muncul terang lalu memudar di ujung lintasan
          m.material.opacity = Math.sin(progres * Math.PI) * 0.95;
        }
      }

      // Paralaks halus pada pegunungan salju & hutan cemara di latar bawah
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
      geometriBulan.dispose();
      materialBulan.dispose();
      teksturBulan.dispose();
      geometriPlanetGas.dispose();
      materialPlanetGas.dispose();
      teksturPlanetGas.dispose();
      geometriCincin.dispose();
      materialCincin.dispose();
      teksturCincin.dispose();
      geometriPlanetEs.dispose();
      materialPlanetEs.dispose();
      teksturPlanetEs.dispose();
      teksturHalo.dispose();
      materialHalo.dispose();
      geometriBintang.dispose();
      materialBintang.dispose();
      teksturBintang.dispose();
      teksturMeteor.dispose();
      daftarMeteor.forEach((m) => {
        m.geometri.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {/* Kanvas WebGL 3D: Bulan, Planet Bercincin, Planet Es, Bintang, & Meteor */}
      <div ref={wadahRef} className="absolute inset-0" />

      {/* Lanskap Pegunungan Salju & Pepohonan Cemara Natal di bagian bawah */}
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[48vh] w-full sm:h-[54vh]"
      >
        <defs>
          <linearGradient id="gradGunungJauh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334e7b" />
            <stop offset="55%" stopColor="#172a4f" />
            <stop offset="100%" stopColor="#0b152c" />
          </linearGradient>
          <linearGradient id="gradGunungDekat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#233b66" />
            <stop offset="60%" stopColor="#102040" />
            <stop offset="100%" stopColor="#081124" />
          </linearGradient>
          <linearGradient id="gradSaljuPuncak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradLembahSalju" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0a1428" />
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
            <PohonCemaraSalju
              key={`b-${idx}`}
              x={p.x}
              y={p.y}
              skala={p.s}
              warnaPohon="#132a4a"
            />
          ))}
        </g>

        {/* Lapis 3: Hamparan Salju Depan & Hutan Pohon Cemara (Pohon Natal) */}
        <g ref={hutanDepanRef}>
          <path
            d="M-40,468 Q280,438 680,465 T1480,455 L1480,520 L-40,520 Z"
            fill="#0d1b33"
          />
          {/* Garis salju berkilau di punggung bukit */}
          <path
            d="M-40,468 Q280,438 680,465 T1480,455"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="2.5"
            strokeOpacity="0.45"
          />
          {pohonLapisDepan.map((p, idx) => (
            <PohonCemaraSalju
              key={`f-${idx}`}
              x={p.x}
              y={p.y}
              skala={p.s}
              warnaPohon="#09162b"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
