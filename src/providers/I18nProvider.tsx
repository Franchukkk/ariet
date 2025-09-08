"use client";

import { useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n, { defaultNS, ensureNSLoaded, fallbackLng } from "../i18n/client"

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem("lng") || fallbackLng;
      const want = saved.split("-")[0];
      const current = (i18n.language || fallbackLng).split("-")[0];

      if (current !== want) {
        await i18n.changeLanguage(want);
      }

      await ensureNSLoaded(want, defaultNS);
      document.documentElement.lang = want;
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
