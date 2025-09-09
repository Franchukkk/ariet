"use client";

import { useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

const CATEGORIES = ["categories.new", "categories.project", "categories.best"];

export const Categories = () => {
  const [active, setActive] = useState(0);
  const { t } = useTranslation("common");

  return (
    <StyledCategories className="flex items-center gap-4 flex-wrap">
      {CATEGORIES.map((key, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={`${active === i ? "active" : ""}`}
        >
          {t(key)}
        </button>
      ))}
    </StyledCategories>
  );
};

const StyledCategories = styled.div`
  button {
    padding: 19.5px 43px;
    border-radius: 12px;
    background: #24242470;
    font-weight: 400;
    font-size: 15px;
    line-height: 100%;
    letter-spacing: 1%;
    text-align: center;
    transition: all 0.3s;
    border: 1px dashed transparent;

    &:hover,
    &.active {
      border: 1px dashed #ffffff;
    }

    @media (max-width: 600px) {
      width: 100%;
    }
  }
`;
