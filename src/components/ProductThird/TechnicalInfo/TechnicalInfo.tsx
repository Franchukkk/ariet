import bg from "@/assets/img/tech-info-bg.png"
import type { StaticImageData } from "next/image"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Button } from "./Button"
import { BuyButton } from "./BuyButton"
import { Title } from "./Title"

type ImgLike = string | StaticImageData;

export const TechnicalInfo = ({ bgImg = bg }: { bgImg?: ImgLike }) => {
  const { t } = useTranslation("common");

  return (
    <div className="main-wrapper">
      <StyledTechnicalInfo
        $bg={bgImg}
        className="flex flex-col justify-center items-center"
      >
        <Title />
        <Button title={t("ups.detailed_specs")} />
        <Button title={t("ups.detailed_specs")} type="light" />
        <BuyButton />
      </StyledTechnicalInfo>
    </div>
  );
};

const StyledTechnicalInfo = styled.div<{ $bg: ImgLike }>`
  padding: 83px 80px 84px;
  border-radius: 8px;
  background: ${({ $bg }) =>
    `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
  margin-bottom: 191px;

  @media (max-width: 800px) {
    padding: 40px;
  }
`;
