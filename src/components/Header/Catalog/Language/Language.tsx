"use client";

import Arrow from "@/assets/img/select-arrow.svg"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Dropdown } from "./Dropdown"

export const Language = () => {
  const { i18n } = useTranslation();
  const base = (i18n.resolvedLanguage || i18n.language || "ru")
    .split("-")[0] as "en" | "ru";

  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<"en" | "ru">(base);
  const langRef = useRef<HTMLDivElement>(null);

  
  const ensureCommon = async (lng: "en" | "ru") => {
    const ns = "common";
    const short = lng.split("-")[0];
    if (!i18n.hasResourceBundle(short, ns)) {
      const res = await fetch(`/locales/${short}/${ns}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Missing /locales/${short}/${ns}.json`);
      const data = await res.json();
      i18n.addResourceBundle(short, ns, data, true, true);
    }
  };

  useEffect(() => {
    const onChange = (lng: string) => {
      setCurrent(lng.split("-")[0] as "en" | "ru");
    };
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, [i18n]);

  
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("click", onOutside);
    return () => document.removeEventListener("click", onOutside);
  }, []);

  const handleSelect = async (lng: "en" | "ru") => {
    if (lng === current) {
      setIsOpen(false);
      return;
    }
    await ensureCommon(lng);       
    localStorage.setItem("lng", lng);
    await i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <StyledLanguage ref={langRef} className={isOpen ? "open" : ""}>
      <button
        type="button"
        className="flex items-center gap-[5px]"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((s) => !s);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{current === "ru" ? "РУС" : "ENG"}</span>
        <Arrow />
      </button>

      <Dropdown current={current} onSelect={handleSelect} />
    </StyledLanguage>
  );
};


const StyledLanguage = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #f2f2f2;
  position: relative;
  cursor: pointer;
  svg {
    transition: all 0.3s;
    path {
      transition: all 0.3s;
    }
  }
  &.open {
    color: #4bc785;
    svg {
      transform: rotate(180deg);
      path {
        fill: #4bc785;
      }
    }
    .dropdown {
      opacity: 1;
      visibility: visible;
    }
  }
`;
