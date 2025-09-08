import styled from "styled-components";
import bg from "@/assets/img/tech-info-bg.png";
import { Title } from "./Title";
import { Button } from "./Button";
import { BuyButton } from "./BuyButton";
import type { StaticImageData } from "next/image";

type ImgLike = string | StaticImageData;

export const TechnicalInfo = ({ bgImg = bg }: { bgImg?: ImgLike }) => (
  <div className="main-wrapper">
    <StyledTechnicalInfo
      $bg={bgImg}
      className="flex flex-col justify-center items-center"
    >
      <Title />
      <Button title="Детальные характеристики" />
      <Button title="Детальные характеристики" type="light" />
      <BuyButton />
    </StyledTechnicalInfo>
  </div>
);



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
