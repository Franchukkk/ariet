import styled from "styled-components";

export const Description = () => (
  <StyledDescription>
    <div className="label">Тип</div>
    <div className="value">Онлайн с двойным преобразованием</div>
    <div className="label">Мощность</div>
    <div className="value">6000 В⋅А / 5400 Вт</div>
    <div className="label">Форма напряжения</div>
    <div className="value">Чистая синусоида</div>
    <div className="label">Батареи</div>
    <div className="value">7,5 Ач по 12 шт.  </div>
    <div className="label">КПД</div>
    <div className="value"> {`>`} 99%</div>
    <div className="label">Входное напряжение</div>
    <div className="value">110-300 В</div>
    <div className="label">Выходное напряжение</div>
    <div className="value">220/230/240 В</div>
    <div className="label">Подключение</div>
    <div className="value">Клеммная колодка (terminal block)</div>
  </StyledDescription>
);

const StyledDescription = styled.div`
  display: grid;
  grid-template-columns: 192px 1fr;
  gap: 16px 22px;
  position: relative;
  &::before {
    content: "";
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    width: 50px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(0, 0, 0, 1) 100%
    );
    position: absolute;
  }
  .label {
    font-family: TT Firs Neue;
    font-weight: 100;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ffffff80;
  }
  .value {
    font-family: TT Firs Neue;
    font-weight: 300;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffc9;
    border-bottom: 1px solid #ffffff80;
    padding-bottom: 15px;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
