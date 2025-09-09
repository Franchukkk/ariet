"use client";

import Link from "next/link"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

const LINKS = [
  {
    titleKey: "catalog.commercial",
    items: [
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
    ],
  },
  {
    titleKey: "catalog.commercial",
    items: [
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
    ],
  },
  {
    titleKey: "catalog.commercial",
    items: [
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
    ],
  },
  {
    titleKey: "catalog.commercial",
    items: [
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
      { titleKey: "catalog.category", link: "/" },
    ],
  },
];

export const Dropdown = () => {
  const { t } = useTranslation("common");

  return (
    <StyledDropdown className="dropdown">
      {LINKS.map(({ titleKey, items }, i) => (
        <div key={i}>
          <div className="group-title">{t(titleKey)}</div>
          <div className="flex flex-col gap-3">
            {items.map((link, j) => (
              <Link key={j} href={link.link}>
                {t(link.titleKey)}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  width: 400px;
  background: #000000;
  left: 0;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #f2f2f2;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 100;

  .group-title {
    margin-bottom: 10px;
    font-size: 12px;
    color: #ffffff70;
  }

  a:hover {
    color: #4bc785;
  }
`;
