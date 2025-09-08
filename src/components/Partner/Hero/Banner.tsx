import styled from "styled-components";
import type { StaticImageData } from "next/image";
import testBg from "@/assets/img/test.png";
import { Background } from "./Background";

type ImgLike = string | StaticImageData;

export const Banner = ({ bg = testBg }: { bg?: ImgLike }) => (
  <StyledBanner $bg={bg}>
    <Background />
  </StyledBanner>
);

const StyledBanner = styled.div<{ $bg: ImgLike }>`
  width: 404px;
  height: 496px;
  background: ${({ $bg }) =>
    `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
  position: relative;
  overflow: hidden;

  @media (max-width: 1200px) {
    width: 204px;
    height: 296px;
  }
`;
