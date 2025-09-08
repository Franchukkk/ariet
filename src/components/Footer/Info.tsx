"use client";

import LogoSvg from "@/assets/img/logo-footer.svg"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Info = () => {
  const { t } = useTranslation("common");

  return (
    <StyledInfo className="flex items-center justify-between">
      <div className="flex items-center gap-[41px]">
        <div>{t("Info.copyright_year")}</div>
        <div>{t("Info.all_rights_reserved")}</div>
      </div>

      <LogoSvg aria-label="footer logo" />

      <Link href="/">{t("Info.privacy_policy")}</Link>
    </StyledInfo>
  );
};

const StyledInfo = styled.div`
  font-weight: 300;
  font-size: 17px;
  line-height: 25.5px;
  letter-spacing: 0%;
  color: #f2f2f2a8;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
    font-size: 14px;
  }
`;
