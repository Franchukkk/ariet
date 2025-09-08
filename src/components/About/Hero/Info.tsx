"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Info = () => {
  const { t } = useTranslation("common");

  return (
    <StyledInfo className="flex flex-col gap-[24px]">
      <p>
        <span className="label">{t("Info.headquarters")}</span>{" "}
        {t("List.barcelona_spain")}
      </p>
      <p>
        <span className="label">{t("Info.warehouses")}</span>{" "}
        {t("Info.across_europe_and_us_for")}
        <br />
        {t("Info.fast_delivery")}
      </p>
    </StyledInfo>
  );
};

const StyledInfo = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 21px;
  letter-spacing: 0%;
  text-align: right;
  text-transform: uppercase;
  color: #ffffff5e;
  span {
    display: block;
    color: #ffffff;
  }
  @media (max-width: 1000px) {
    align-items: center;
    text-align: center;
  }
`;
