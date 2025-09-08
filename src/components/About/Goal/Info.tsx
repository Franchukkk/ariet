"use client";

import photo from "@/assets/img/about-goal.png"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Info = () => {
  const { t } = useTranslation("common");

  return (
    <StyledInfo>
      <p className="text">
        {t("Info.lorem_ipsum")}
      </p>
      <Image src={photo} alt="goal" />
    </StyledInfo>
  );
};

const StyledInfo = styled.div`
  font-weight: 100;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
  p {
    padding: 125px 80px 117px 38px;
  }
  img {
    width: 100%;
    height: 345px;
    object-fit: cover;
  }
  @media (max-width: 1200px) {
    p {
      padding: 50px 10px;
    }
  }
`;
