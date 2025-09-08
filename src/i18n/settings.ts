export const languages = ["en", "ru"] as const;
export type Language = (typeof languages)[number];

export const defaultNS = "common";
export const fallbackLng: Language = "ru";