"use client";

import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const TitleMyAccount = () => {
  const { t } = useTranslation("common");
  return (
    <div className="main-wrapper">
      <StyledTitle className="text-[50px] leading-[50px] font-demibold mb-[34px] mt-[94px] uppercase">{t("MyAccount.title")}</StyledTitle>
    </div>
  );
};

const StyledTitle = styled.h1`

@media (max-width: 1000px) {
    font-size: 30px;
    line-height: 1;
    margin-bottom: 20px;
    margin-top: 40px;
}

`