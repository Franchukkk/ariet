import styled from "styled-components";
import type { StaticImageData } from "next/image";

type ImgLike = string | StaticImageData;

interface Props {
  photo: ImgLike;
}

export const Photo = ({ photo }: Props) => {
  const src = typeof photo === "string" ? photo : photo.src;
  return <StyledPhoto src={src} alt="" />;
};

const StyledPhoto = styled.img`
  width: 315px;
  margin: 0 auto 57px;
  `;
