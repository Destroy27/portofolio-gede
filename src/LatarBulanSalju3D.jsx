  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {/* Kanvas WebGL 3D: hanya Bulan, Planet Bercincin, Planet Es, Bintang, & Meteor */}
      <div ref={wadahRef} className="absolute inset-0" />
    </div>
  );
}
