export function Kugel() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[100px] -right-[100px] z-0 h-[400px] w-[400px] select-none rounded-full opacity-80"
      style={{
        backgroundImage: "radial-gradient(#CC5C3B 2px, transparent 2px)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}
