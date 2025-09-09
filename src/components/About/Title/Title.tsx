"use client"
import styled from "styled-components"

export const Title = () => (
  <StyledTitle>
    Voltage Regulator
    <div className="light">Voltage Regulator</div>
  </StyledTitle>
);

const StyledTitle = styled.div`
  font-weight: 700; 
  font-size: 111px;
  line-height: 100%;
  letter-spacing: 0%;
  text-transform: uppercase;
  text-align: center;
  color: transparent;
  -webkit-text-stroke: 1px #fff;
  position: relative;
  margin-bottom: 52px;
  white-space: nowrap;
  overflow: hidden;
  .light {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: absolute;
    height: 32px;
    width: 100%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background: #4bc785;
    color: #fff;
    -webkit-text-stroke: unset;
    white-space: nowrap;
  }
  @media (max-width: 1400px) {
    font-size: 90px;
  }
  @media (max-width: 1200px) {
    font-size: 60px;
    .light {
      height: 20px;
    }
  }
  @media (max-width: 800px) {
    font-size: 40px;
    .light {
      height: 10px;
    }
  }
  @media (max-width: 700px) {
    font-size: 30px;
    .light {
      height: 5px;
    }
  }
`;
