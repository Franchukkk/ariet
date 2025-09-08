import type { StaticImageData } from "next/image"
import styled from "styled-components"
import { Slide } from "./Slide"
import { Subtitle } from "./Subtitle"
import { Title } from "./Title"

type ImgLike = string | StaticImageData;

interface Props {
  title: string;
  subtitle: string;
  slide: number;
  totalSlides: number;
  photo: ImgLike;
}

export const Card = ({ title, subtitle, slide, totalSlides, photo }: Props) => (
  <StyledCard $photo={photo} className="flex flex-col justify-end">
    <Title title={title} />
    <Subtitle subtitle={subtitle} />
    <Slide slide={slide} totalSlides={totalSlides} />
  </StyledCard>
);

const StyledCard = styled.div<{ $photo: ImgLike }>`
  padding: 37px 27px;
  height: 446px;
  margin: 36px 44px;
  background: ${({ $photo }) =>
    `url(${typeof $photo === "string" ? $photo : $photo.src}) center/cover no-repeat`};
  border-radius: 8px;

  @media (max-width: 1000px) {
    padding: 20px;
    margin: 0;
    width: 100%;
  }
`;
