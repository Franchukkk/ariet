import styled from "styled-components";
import type { StaticImageData } from "next/image";
import { Title } from "./Title";
import { HomeLink } from "./HomeLink";

type ImgLike = string | StaticImageData;

interface Props {
  title: string;
  photo: ImgLike;
}

export const Card = ({ title, photo }: Props) => (
  <StyledCard className="flex flex-col justify-end" $photo={photo}>
    <Title title={title} />
    <HomeLink />
  </StyledCard>
);


const StyledCard = styled.div<{ $photo: ImgLike }>`
  border-radius: 24px;
  height: 657px;
  width: 100%;
  background: ${({ $photo }) =>
    `url(${typeof $photo === "string" ? $photo : $photo.src}) center/cover no-repeat`};

  @media (max-width: 700px) {
    height: 500px;
  }
`;
