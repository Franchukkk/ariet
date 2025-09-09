"use client";

import IconSvg from "@/assets/img/guide.svg"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const DownloadButton = () => {
  const { t } = useTranslation("common");

  return (
    <StyledDownloadButton className="flex items-center justify-center gap-[15px]">
      {t("dashboard.download_guide")} <IconSvg aria-label={t("dashboard.download_guide")} />
    </StyledDownloadButton>
  );
};

const StyledDownloadButton = styled.button`
  padding: 15px 73px;
  height: 58px;
  font-weight: 500;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  border: 1px solid #1dcf94;
  border-radius: 61px;
  margin: 0 auto 73px;
  transition: all 0.3s;

  &:hover {
    background: #1dcf94;
  }
`;
