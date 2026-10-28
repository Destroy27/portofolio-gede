import { useEffect, useRef } from "react";
import * as THREE from "three";

// Membuat tekstur permukaan dan bump-map kawah Bulan secara prosedural
function buatTeksturBulan() {
  const lebar = 1024;
  const tinggi = 512;
  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const ctx = kanvas.getContext("2d");

  // Dasar warna permukaan bulan
  const gradDasar = ctx.createLinearGradient(0, 0, 0, tinggi);
  gradDasar.addColorStop(0, "#d8dde6");
  gradDasar.addColorStop(0.5, "#eef2f7");
  gradDasar.addColorStop(1, "#cfd6e2");
  ctx.fillStyle = gradDasar;
  ctx.fillRect(0, 0, lebar, tinggi);

  // Fungsi pseudo-random deterministik agar kawah konsisten
  let seed = 42;
  const acak = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // Lautan bulan (Lunar Maria - area gelap lembut)
  for (let i = 0; i < 18; i++) {
    const x = acak() * lebar;
    const y = (0.15 + acak() * 0.7) * tinggi;
    const r = 45 + acak() * 110;
    const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
    grad.addColorStop(0, "rgba(130, 140, 158, 0.42)");
    grad.addColorStop(0.6, "rgba(148, 158, 175, 0.22)");
    grad.addColorStop(1, "rgba(148, 158, 175, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Kawah-kawah bulan dengan cincin terang dan cekungan gelap
  for (let i = 0; i < 260; i++) {
    const x = acak() * lebar;
    const y = acak() * tinggi;
    const r = 3 + Math.pow(acak(), 3) * 38;

    // Cincin luar kawah (terang)
    const rim = ctx.createRadialGradient(x, y, r * 0.65, x, y, r * 1.15);
    rim.addColorStop(0, "rgba(255, 255, 255, 0)");
    rim.addColorStop(0.5, "rgba(255, 255, 255, 0.55)");
    rim.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Cekungan dalam kawah (gelap)
    const cekung = ctx.createRadialGradient(
      x - r * 0.15,
      y - r * 0.15,
      r * 0.05,
      x,
      y,
      r * 0.85,
    );
    cekung.addColorStop(0, "rgba(110, 120, 138, 0.55)");
    cekung.addColorStop(0.75, "rgba(140, 150, 168, 0.35)");
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

// Membuat tekstur butiran salju lembut bercahaya
function buatTeksturSalju() {
  const kanvas = document.createElement("canvas");
  kanvas.width = 64;
  kanvas.height = 64;
  const ctx = kanvas.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.4, "rgba(235, 245, 255, 0.85)");
  grad.addColorStop(0.75, "rgba(200, 225, 255, 0.25)");
  grad.addColorStop(1, "rgba(200, 225, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(kanvas);
}

// Membuat tekstur pendaran cahaya (halo) di belakang Bulan
function buatTeksturHalo() {
  const kanvas = document.createElement("canvas");
  kanvas.width = 256;
  kanvas.height = 256;
  const ctx = kanvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 124);
  grad.addColorStop(0, "rgba(224, 242, 254, 0.65)");
  grad.addColorStop(0.35, "rgba(186, 230, 253, 0.32)");
  grad.addColorStop(0.7, "rgba(125, 211, 252, 0.1)");
  grad.addColorStop(1, "rgba(125, 211, 252, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(kanvas);
}

export default function LatarBulanSalju3D() {
  const wadahRef = useRef(null);

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
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wadah.appendChild(renderer.domElement);

    // Pencahayaan 3D untuk efek relief kawah Bulan
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    sunLight.position.set(6, 4, 7);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.8, 25);
    rimLight.position.set(-6, -3, 3);
    scene.add(rimLight);

    // Grup Bulan 3D (Bola Bulan + Halo + Cincin Orbit)
    const grupBulan = new THREE.Group();
    scene.add(grupBulan);

    const teksturBulan = buatTeksturBulan();
    const geometriBulan = new THREE.SphereGeometry(1.65, 64, 64);
    const materialBulan = new THREE.MeshStandardMaterial({
      map: teksturBulan,
      bumpMap: teksturBulan,
      bumpScale: 0.065,
      roughness: 0.78,
      metalness: 0.08,
      emissive: new THREE.Color(0x1e293b),
      emissiveIntensity: 0.18,
    });
    const meshBulan = new THREE.Mesh(geometriBulan, materialBulan);
    grupBulan.add(meshBulan);

    // Cincin es tipis yang mengelilingi Bulan
    const geometriCincin = new THREE.TorusGeometry(2.35, 0.018, 16, 120);
    const materialCincin = new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.45,
    });
    const meshCincin = new THREE.Mesh(geometriCincin, materialCincin);
    meshCincin.rotation.x = Math.PI * 0.42;
    meshCincin.rotation.y = Math.PI * 0.12;
    grupBulan.add(meshCincin);

    // Sprite pendaran cahaya Bulan
    const teksturHalo = buatTeksturHalo();
    const materialHalo = new THREE.SpriteMaterial({
      map: teksturHalo,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const spriteHalo = new THREE.Sprite(materialHalo);
    spriteHalo.scale.set(6.4, 6.4, 1);
    grupBulan.add(spriteHalo);

    // Partikel Salju 3D berlapis kedalaman
    const jumlahSalju = 520;
    const posisiSalju = new Float32Array(jumlahSalju * 3);
    const dataGerakSalju = [];

    for (let i = 0; i < jumlahSalju; i++) {
      posisiSalju[i * 3] = (Math.random() - 0.5) * 24;
      posisiSalju[i * 3 + 1] = (Math.random() - 0.5) * 18;
      posisiSalju[i * 3 + 2] = -6 + Math.random() * 11; // Kedalaman Z bervariasi

      dataGerakSalju.push({
        kecepatanY: 0.45 + Math.random() * 1.1,
        ayunanX: 0.3 + Math.random() * 0.7,
        frekuensi: 0.6 + Math.random() * 1.4,
        fase: Math.random() * Math.PI * 2,
      });
    }

    const geometriSalju = new THREE.BufferGeometry();
    geometriSalju.setAttribute(
      "position",
      new THREE.BufferAttribute(posisiSalju, 3),
    );

    const teksturSalju = buatTeksturSalju();
    const materialSalju = new THREE.PointsMaterial({
      size: 0.24,
      map: teksturSalju,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const sistemSalju = new THREE.Points(geometriSalju, materialSalju);
    scene.add(sistemSalju);

    // Pelacakan Scroll & Kursor untuk Animasi Bulan dan Salju
    let targetScroll = 0;
    let currentScroll = 0;
    let scrollSebelumnya = window.scrollY;
    let doronganScroll = 0;
    let targetKursor = { x: 0, y: 0 };
    let currentKursor = { x: 0, y: 0 };

    const saatScroll = () => {
      const tinggiMaks = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      targetScroll = Math.min(1, Math.max(0, window.scrollY / tinggiMaks));
      const delta = window.scrollY - scrollSebelumnya;
      scrollSebelumnya = window.scrollY;
      doronganScroll += delta * 0.0025;
      doronganScroll = Math.max(-1.2, Math.min(1.2, doronganScroll));
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

      // Interpolasi halus (lerp) untuk progres scroll dan posisi kursor
      currentScroll += (targetScroll - currentScroll) * Math.min(1, dt * 4.2);
      doronganScroll *= Math.pow(0.9, dt * 60);
      currentKursor.x +=
        (targetKursor.x - currentKursor.x) * Math.min(1, dt * 3.5);
      currentKursor.y +=
        (targetKursor.y - currentKursor.y) * Math.min(1, dt * 3.5);

      const mobile = window.innerWidth < 768;
      const skalaBulan = mobile ? 0.68 : 1;
      grupBulan.scale.setScalar(skalaBulan);

      // Lintasan Bulan 3D saat di-scroll: bergerak melengkung dari kanan atas ke kiri lalu ke tengah
      const jejakX =
        Math.cos(currentScroll * Math.PI * 1.65) * (mobile ? 1.8 : 3.6) +
        currentKursor.x * 0.45;
      const jejakY =
        1.55 -
        currentScroll * 3.1 +
        Math.sin(t * 0.7) * 0.18 +
        currentKursor.y * 0.35;
      const jejakZ = -1.2 + Math.sin(currentScroll * Math.PI) * 1.4;

      grupBulan.position.set(jejakX, jejakY, jejakZ);

      // Putaran Bulan 3D mengikuti waktu + putaran ekstra saat halaman di-scroll
      meshBulan.rotation.y = t * 0.16 + currentScroll * Math.PI * 2.4;
      meshBulan.rotation.x =
        0.15 + Math.sin(currentScroll * Math.PI) * 0.35 - currentKursor.y * 0.15;

      // Cincin orbit berputar berlawanan arah secara halus
      meshCincin.rotation.z = -t * 0.25 - currentScroll * Math.PI;
      meshCincin.rotation.x =
        Math.PI * 0.42 + Math.sin(currentScroll * Math.PI * 2) * 0.2;

      // Cahaya matahari bergeser mengikuti scroll untuk efek fase bayangan Bulan
      sunLight.position.x = 6 * Math.cos(currentScroll * 1.4);
      sunLight.position.z = 5 + 3 * Math.sin(currentScroll * 1.4);

      // Perbarui posisi butiran salju 3D
      const posAttr = geometriSalju.attributes.position;
      const arr = posAttr.array;

      for (let i = 0; i < jumlahSalju; i++) {
        const g = dataGerakSalju[i];
        const idx = i * 3;

        // Salju turun ditambah efek hembusan saat halaman di-scroll
        arr[idx + 1] -= (g.kecepatanY + doronganScroll * 2.2) * dt;
        arr[idx] +=
          (Math.sin(t * g.frekuensi + g.fase) * g.ayunanX +
            currentKursor.x * 0.35) *
          dt;

        // Reset salju yang lewat batas bawah/atas kembali ke layar
        if (arr[idx + 1] < -9) {
          arr[idx + 1] = 9;
          arr[idx] = (Math.random() - 0.5) * 24;
        } else if (arr[idx + 1] > 9) {
          arr[idx + 1] = -9;
          arr[idx] = (Math.random() - 0.5) * 24;
        }

        if (arr[idx] > 12) arr[idx] = -12;
        if (arr[idx] < -12) arr[idx] = 12;
      }

      posAttr.needsUpdate = true;

      // Ayunan kamera 3D halus
      sistemSalju.rotation.y = currentKursor.x * 0.08;
      sistemSalju.rotation.x = -currentKursor.y * 0.05;

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
      geometriCincin.dispose();
      materialCincin.dispose();
      teksturHalo.dispose();
      materialHalo.dispose();
      geometriSalju.dispose();
      materialSalju.dispose();
      teksturSalju.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wadahRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
