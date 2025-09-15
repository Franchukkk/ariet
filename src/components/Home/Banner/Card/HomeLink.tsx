"use client";

import Link from "next/link"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const HomeLink = () => {
  const { t } = useTranslation("common");
  return (
    <StyledLink href="/products">
      {t("HomeLink.to_catalog")}
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 206px;
  height: 206px;
  border-radius: 100%;
  box-shadow: 39px 65px 89.6px 0px #4bc7854d;
  background: linear-gradient(180deg, #4bc785 0%, #256141 100%);
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;
  color: #000000;
  position: absolute;
  bottom: 103px;
  right: 32%;
  @media (max-width: 700px) {
    /* width: 100px;
    height: 100px;
    bottom: 40px;
    right: 20%; */
    display: none;
  }
`;
