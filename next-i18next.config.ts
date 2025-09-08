import type { NextConfig } from "next"

export const i18n: NonNullable<NextConfig["i18n"]> = {
  defaultLocale: "ru",
  locales: ["en", "ru"],
  localeDetection: false,
};

export default { i18n };