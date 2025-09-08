import styled from "styled-components";

export const Info = () => (
  <StyledInfo>
    <div className="main-wrapper subtitle">
      Отгрузка в день заказа и мгновенная техническая <br /> помощь от нашей
      команды поддержки
    </div>
    <div className="title">поддержка</div>
  </StyledInfo>
);

const StyledInfo = styled.div`
  z-index: -2;
  position: relative;
  .subtitle {
    font-family: TT Firs Neue;
    font-weight: 100;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
    margin-bottom: 14px;
  }
  .title {
    font-weight: 900;
    font-size: 146.99px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #ffffff1f;
    text-align: center;
    border-top: 1px solid #313131;
    color: transparent;
    -webkit-text-stroke: 0.8px #ffffff1f;
  }
`;
