"use client";

import LogoSvg from "@/assets/img/outline-logo.svg"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const LogoCard = () => {
  const { t } = useTranslation("common");

  return (
    <StyledLogoCard>
      <LogoSvg aria-label="logo-svg" />
      <div dangerouslySetInnerHTML={{ __html: t("logo_card.text") }} />
    </StyledLogoCard>
  );
};

const StyledLogoCard = styled.div`
  padding: 43px 28px 26px 23px;
  font-weight: 200;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;

  img {
    margin-bottom: 34px;
    width: 107px;
  }
`;
