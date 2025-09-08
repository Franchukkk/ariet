import styled from "styled-components";
import { addZero } from "@/helpers/index";

interface Props {
  slide: number;
  totalSlides: number;
}

export const Slide = ({ slide, totalSlides }: Props) => (
  <StyledSlide>
    {addZero(slide)}/ <span>{addZero(totalSlides)}</span>
  </StyledSlide>
);

const StyledSlide = styled.div`
  font-weight: 400;
  font-size: 26px;
  line-height: 100%;
  letter-spacing: 1%;
  text-transform: uppercase;
  color: #ffffff80;
  span {
    font-weight: 250;
    font-size: 15px;
    color: #ffffff80;
  }
`;
