import styled from "styled-components";
import ArrowSvg from "@/assets/img/arrow.svg";

export const Buttons = () => (
  <StyledButtons className="flex flex-col gap-[19px]">
    <button>Детальные характеристики</button>
    <button className="light">Руководство</button>
    <button className="outline-btn">
      <ArrowSvg aria-label="icon" /> Где купить?!
    </button>
  </StyledButtons>
);

const StyledButtons = styled.div`
  button {
    padding: 20px;
    border-radius: 61px;
    height: 58px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4bc785;
    border: 1px solid #4bc785;
    transition: all 0.3s;
    font-weight: 500;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0%;
    text-align: center;
    color: #121212;
    &:hover {
      background: #ffffff;
    }
    &.light {
      background: #ffffff;
      &:hover {
        background: #4bc785;
      }
    }
    &.outline-btn {
      background: none;
      color: #ffffff;
      position: relative;
      img {
        position: absolute;
        left: 30px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:hover {
        background: #4bc785;
      }
    }
  }
`;
