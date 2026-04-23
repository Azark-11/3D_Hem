import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-[#f5f1e8] px-4 text-center">
      <p className="text-[#ff6b1a] text-7xl font-bold mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        404
      </p>
      <h1 className="text-2xl font-bold mb-2">Sidan hittades inte</h1>
      <p className="text-[#f5f1e8]/50 mb-8">
        Den här sidan finns inte eller har tagits bort.
      </p>
      <Link
        href="/butik"
        className="px-6 py-3 bg-[#ff6b1a] text-[#0a0a0a] font-semibold uppercase tracking-wide text-sm hover:bg-[#e55a0a] transition-colors"
      >
        Tillbaka till butiken
      </Link>
    </div>
  );
}
