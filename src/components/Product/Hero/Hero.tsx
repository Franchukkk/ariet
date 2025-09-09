import bg from "@/assets/img/hero-bg.png"
import type { StaticImageData } from "next/image"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Breadcrumbs } from "../../Breadcrumbs"
import { Subtitle } from "./Subtitle"
import { Title } from "./Title"

type ImgLike = string | StaticImageData;

export const Hero = ({ bgImg }: { bgImg?: ImgLike }) => {
  const { t } = useTranslation("common");

  return (
    <div className="main-wrapper">
      <StyledHero className="flex flex-col justify-between" $bg={bgImg || bg}>
        <Breadcrumbs
          path={[
            t("breadcrumbs.home"),
            t("breadcrumbs.products"),
            t("products.online_ups"),
          ]}
        />
        <div>
          <Title />
          <Subtitle />
        </div>
      </StyledHero>
    </div>
  );
};


const StyledHero = styled.div<{ $bg: ImgLike }>`
  padding: 32px 33px 47px;
  border-radius: 24px;
  height: 657px;
  background: ${({ $bg }) =>
    `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
  margin-bottom: 95px;

  @media (max-width: 800px) {
    height: 400px;
    padding: 20px;
    margin-bottom: 80px;
  }
`;
