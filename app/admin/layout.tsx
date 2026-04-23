import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8]">
      {/* Admin navbar */}
      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-bold text-base tracking-tight text-[#f5f1e8]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              3D<span className="text-[#ff6b1a]">HEM</span>
              <span className="ml-2 text-xs font-normal text-[#f5f1e8]/40 uppercase tracking-widest">
                Admin
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/products/new"
                className="text-sm text-[#ff6b1a] hover:underline transition-colors"
              >
                + New Product
              </Link>
            </nav>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-xs text-[#f5f1e8]/40 hover:text-[#ff6b1a] transition-colors uppercase tracking-wide"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
