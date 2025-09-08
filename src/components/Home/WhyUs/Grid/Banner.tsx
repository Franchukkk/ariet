import styled from "styled-components";
import type { StaticImageData } from "next/image";
import photo from "@/assets/img/people-1.png";

type ImgLike = string | StaticImageData;

export const Banner = () => <StyledBanner $bg={photo} />;

const StyledBanner = styled.div<{ $bg: ImgLike }>`
  width: 100%;
  height: 100%;
  background: ${({ $bg }) =>
    `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
`;
