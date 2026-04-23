import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p
              className="font-bold text-xl tracking-tight text-[#f5f1e8] mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              3D<span className="text-[#ff6b1a]">HEM</span>
            </p>
            <p className="text-sm text-[#f5f1e8]/40">{t("vat_info")}</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <Link
              href="/butik"
              className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
            >
              Butik
            </Link>
            <Link
              href="/om-oss"
              className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href="/kontakt"
              className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
            >
              {t("contact")}
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <Link
              href="/integritetspolicy"
              className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/kopvillkor"
              className="text-sm text-[#f5f1e8]/60 hover:text-[#ff6b1a] transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-[#2a2a2a] pt-6">
          <p className="text-xs text-[#f5f1e8]/30">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
