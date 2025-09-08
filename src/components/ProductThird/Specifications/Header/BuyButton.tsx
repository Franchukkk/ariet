import styled from "styled-components";
import ArrowIcon from "@/assets/img/arrow.svg";

export const BuyButton = () => (
  <StyledBuyButton className="flex items-center justify-center">
    <ArrowIcon />
    <span>Где купить?!</span>
  </StyledBuyButton>
);

const StyledBuyButton = styled.button`
  border: 1px solid #4bc785;
  padding: 0 31px;
  height: 58px;
  border-radius: 61px;
  width: 358px;
  font-weight: 600;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  position: relative;
  transition: all 0.3s;
  svg {
    position: absolute;
    left: 31px;
  }
  &:hover {
    background: #4bc785;
  }
`;
