import styled from "styled-components";
import ArrowSvg from "@/assets/img/slide-arrow.svg";

interface Props {
  slides: string[];
  active: number;
  onNavigate: (index: number) => void;
}

export const Slides = ({ slides, active, onNavigate }: Props) => (
  <StyledSlides className="flex flex-col gap-[14px]">
    {slides.map((s, i) => (
      <div
        key={i}
        className={`flex items-center gap-2.5 ${active === i && "active"}`}
        onClick={() => onNavigate(i)}
      >
        {s}
        <ArrowSvg aria-label="icon" />
      </div>
    ))}
  </StyledSlides>
);

const StyledSlides = styled.div`
  position: absolute;
  top: 36px;
  left: 26px;
  font-weight: 400;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff5e;
  z-index: 3;
  div {
    cursor: pointer;
    img {
      opacity: 0;
      transition: all 0.3s;
    }
    &:hover,
    &.active {
      color: #ffffff;
      img {
        opacity: 1;
      }
    }
  }
  @media (max-width: 700px) {
    display: none;
  }
`;
