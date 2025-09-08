import styled from "styled-components";
import ArrowSvg from "@/assets/img/link-arrow.svg";
import hoverBg from "@/assets/img/category-hover-bg.png";
import { Background } from "./Background";
import Image, { StaticImageData } from "next/image";

type ImgLike = string | StaticImageData;

interface Props {
  className: string;
  topTitle?: string;
  bottomTitle?: string;
  photo: string | StaticImageData;
}

export const Card = ({ className, topTitle, bottomTitle, photo }: Props) => (
  <StyledCard className={`flex flex-col justify-between ${className}`} $bg={hoverBg}>
    <Image src={photo} alt="card of product" className="card-product" />
    <div className="title">{topTitle}</div>
    <div className="flex items-center justify-end card-footer">
      <div className="title">{bottomTitle}</div>
      <div className="link-btn">
        <ArrowSvg aria-label="icon" />
      </div>
    </div>
    <Background />
  </StyledCard>
);

const StyledCard = styled.div<{ $bg: ImgLike }>`
  background: #121212;
  border-radius: 6px;
  font-weight: 600;
  font-size: 18.2px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 22px 13px 12px 32px;
  cursor: pointer;
  border: 1px dashed transparent;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  .card-product {
    position: absolute;
    object-fit: cover;
  }
  .title { z-index: 2; }

  .card-footer {
    gap: 18px;
    .link-btn {
      width: 25.5px;
      height: 25.5px;
      border-radius: 4px;
      border: 0.59px solid #d9d9d940;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      transition: all 0.3s;
      path { transition: all 0.3s; }
    }
  }

  &:hover {
    border: 1px dashed #1dcf94;
    /* use .src when StaticImageData, keep solid bg fallback */
    background: ${({ $bg }) =>
      `url(${typeof $bg === "string" ? $bg : $bg.src}) right/cover no-repeat, #121212`};
    .bg-animation { opacity: 1; }
    .link-btn {
      border: 0.59px solid #1dcf94;
      path { fill: #1dcf94; }
    }
  }
`;
