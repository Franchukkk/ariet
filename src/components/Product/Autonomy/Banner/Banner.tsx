import styled from "styled-components";
import battery from "@/assets/img/battery.png";
import bg from "@/assets/img/battery-bg.png";
import { Background } from "./Background";
import Image, { StaticImageData } from "next/image";

type ImgLike = string | StaticImageData;

export const Banner = () => (
  <StyledBanner $bg={bg}>
    <h3>
      Максимум <br /> автономности
    </h3>
    <Image src={battery} alt="battary img" className="block mx-auto" />
    <Background />
  </StyledBanner>
);



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
    width: 1205px;
    /* background: ${({ $bg }) =>
      `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`}; */
    z-index: -1;
  }
  h3 {
    font-weight: 600;
    font-size: 50px;
    line-height: 48.91px;
    letter-spacing: 0%;
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
      line-height: 1;
      text-align: center;
    }
  }
`;
