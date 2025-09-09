import bg from "@/assets/img/battery-bg.png"
import battery from "@/assets/img/battery.png"
import Image, { StaticImageData } from "next/image"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Background } from "./Background"

type ImgLike = string | StaticImageData;

export const Banner = ({ bgImg = bg }: { bgImg?: ImgLike }) => {
  const { t } = useTranslation("common");

  return (
    <StyledBanner $bg={bgImg}>
      <h3 dangerouslySetInnerHTML={{ __html: t("ups.banner_title") }} />
      <Image src={battery} alt="battery img" className="block mx-auto" />
      <Background />
    </StyledBanner>
  );
};

const StyledBanner = styled.div<{ $bg: ImgLike }>`
  padding: 80px 49px 32px;
  border-right: 1px dashed #313131;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: ${({ $bg }) =>
      `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
    z-index: -1;
  }

  h3 {
    font-weight: 600;
    font-size: 50px;
    line-height: 1.2;
    text-transform: uppercase;
    margin-bottom: 42px;
  }

  @media (max-width: 1000px) {
    padding: 20px;

    img {
      width: 250px;
    }

    h3 {
      font-size: 30px;
      line-height: 1.2;
      text-align: center;
    }
  }
`;
