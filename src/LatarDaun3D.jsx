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

export default function LatarDaun3D() {
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
      <div ref={wadahRef} className="absolute inset-0" />
    </div>
  );
}
