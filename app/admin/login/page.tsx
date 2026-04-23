import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p
            className="font-bold text-2xl text-[#f5f1e8]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            3D<span className="text-[#ff6b1a]">HEM</span>
          </p>
          <p className="text-sm text-[#f5f1e8]/40 mt-1 uppercase tracking-widest">Admin</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
