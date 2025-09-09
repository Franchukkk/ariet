"use client"
import bg from "@/assets/img/about-bg.png"
import type { StaticImageData } from "next/image"
import styled from "styled-components"
import { Background } from "./Background"
import { Description } from "./Description"
import { Info } from "./Info"
import { Title } from "./Title"

type ImgLike = string | StaticImageData;

export const Hero = ({ bgImg }: { bgImg?: ImgLike }) => (
  <StyledHero className="main-wrapper" $bg={bgImg || bg}>
    <div className="flex items-center justify-between top-content">
      <Title />
      <Info />
    </div>
    <Description />
    <Background />
  </StyledHero>
);

const StyledHero = styled.div<{ $bg: ImgLike }>`
  height: 657px;
  width: 100%;
  border-radius: 24px;
  padding: 85px 19px 45px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ $bg }) =>
    `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
  background-position-x: 132px;
  position: relative;
  overflow: hidden;

  @media (max-width: 1000px) {
    text-align: center;
    background-position-x: -150px;

    .top-content {
      flex-direction: column;
    }
  }

  @media (max-width: 800px) {
    padding: 45px 10px;
    background-position-x: -50px;
    height: max-content;
  }
`;
