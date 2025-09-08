"use client";

import en from "@/../public/locales/en/common.json"
import ru from "@/../public/locales/ru/common.json"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

export const fallbackLng = "ru";
export const defaultNS = "common";
export const supportedLngs = ["en", "ru"] as const;

async function loadNamespace(lng: string, ns: string) {
  const short = lng.split("-")[0];
  const res = await fetch(`/locales/${short}/${ns}.json`);
  if (!res.ok) throw new Error(`Missing /locales/${short}/${ns}.json`);
  const data = await res.json();
  i18n.addResourceBundle(short, ns, data, true, true);
}

export async function ensureNSLoaded(lng: string, ns = defaultNS) {
  const short = lng.split("-")[0];
  if (!i18n.hasResourceBundle(short, ns)) {
    await loadNamespace(short, ns);
  }
  await i18n.loadNamespaces(ns);
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: fallbackLng,
    fallbackLng,
    supportedLngs,
    ns: [defaultNS],
    defaultNS,
    resources: {
      ru: { common: ru },
      en: { common: en },
    },
    interpolation: { escapeValue: false },
    //keySeparator: false,
    returnNull: false
  });
}

export default i18n;
