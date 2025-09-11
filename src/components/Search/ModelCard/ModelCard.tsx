import type { StaticImageData } from "next/image"
import styled from "styled-components"
import { Info } from "./Info"
import { NewTag } from "./NewTag"
import { Photo } from "./Photo"

type ImgLike = string | StaticImageData;

interface Props {
  photo: ImgLike;
  title: string;
  category: string;

  isNew?: boolean;
  className?: string;
}

export const ModelCard = ({
  photo,
  title,
  category,
  
  isNew,
  className,
}: Props) => (
  <StyledModelCard className={className}>
    {isNew ? <NewTag /> : null}
    <Photo photo={photo} />
    <Info title={title} category={category} />
  </StyledModelCard>
);

const StyledModelCard = styled.div`
  padding: 76px 20px 31px 30px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 63px;

  &:hover {
    background: #0d0c0c;
    .link-btn {
      background: #1dcf94;
      path { fill: #000000; }
    }
  }
`;
