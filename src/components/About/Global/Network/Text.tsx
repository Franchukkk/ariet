"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Text = () => {

  const { t } = useTranslation("common");
  return (
    <StyledText className="flex gap-[24px]">
      <div className="point" />
      <div>
        <div className="title">{ t("Text.partner_network")}</div>
        <p>
          {t("Text.we_work_with_reliable_local_partners")}
        </p>
      </div>
    </StyledText>
  )
};

const StyledText = styled.div`
  font-weight: 200;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
  padding-left: 38px;
  .title {
    font-weight: 400;
    font-size: 19px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
    margin-bottom: 12px;
    color: #fff;
  }
  .point {
    width: 27px;
    height: 27px;
    border-radius: 100%;
    background: #1dcf94;
    border: 5px solid #e1e1e1;
    flex-shrink: 0;
  }
  @media (max-width: 800px) {
    padding-left: 0;
    font-size: 13px;
    .title {
      font-size: 15px;
      line-height: 1.2;
      margin-bottom: 8px;
    }
  }
`;
