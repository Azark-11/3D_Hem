"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "3dhem-cookie-consent";

export function CookieBanner() {
  const t = useTranslations("cookie");
  // Initialize to null (unknown), resolved client-side to avoid SSR mismatch
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    setVisible(!consent);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null; // null (loading) and false (dismissed) both hide banner

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm border border-[#2a2a2a] bg-[#111] p-4 shadow-xl">
      <p className="text-sm text-[#f5f1e8]/80 mb-3">{t("message")}</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={accept}>
          {t("accept")}
        </Button>
        <Button size="sm" variant="secondary" onClick={reject}>
          {t("reject")}
        </Button>
      </div>
    </div>
  );
}
