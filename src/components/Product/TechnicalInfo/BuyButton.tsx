"use client";

import ArrowIcon from "@/assets/img/arrow.svg"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const BuyButton = () => {
  const { t } = useTranslation("common");

  return (
    <StyledBuyButton className="flex items-center justify-center">
      <ArrowIcon />
      <span>{t("buyButton.label")}</span>
    </StyledBuyButton>
  );
};

const StyledBuyButton = styled.button`
  border: 1px solid #4bc785;
  padding: 0 31px;
  height: 58px;
  border-radius: 61px;
  width: 430px;
  font-weight: 600;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  position: relative;
  transition: all 0.3s;
  svg {
    position: absolute;
    left: 31px;
  }
  &:hover {
    background: #4bc785;
  }
  @media (max-width: 800px) {
    width: 100%;
    font-size: 14px;
  }
`;
