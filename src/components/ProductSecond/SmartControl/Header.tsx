import styled from "styled-components";

export const Header = () => (
  <StyledHeader className="flex items-center justify-between gap-3">
    <div>
      <div className="title">
        Умное управление <br /> питанием
      </div>
      <div className="subtitle">
        ИБП поддерживает несколько интерфейсов управления. Его можно легко{" "}
        <br /> интегрировать в любую IT-инфраструктуру.
      </div>
    </div>
    <p className="info">
      <span>
        Удалённый мониторинг, автоматические <br /> уведомления и безопасное
        отключение <br />
        оборудования
      </span>{" "}
      – всё работает чётко и без <br /> сбоев, где бы вы ни находились.
    </p>
  </StyledHeader>
);

const StyledHeader = styled.div`
  margin-bottom: 59px;
  .title {
    font-weight: 600;
    font-size: 50px;
    line-height: 58px;
    letter-spacing: 0%;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .subtitle {
    font-family: TT Firs Neue;
    font-weight: 200;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
  }
  .info {
    font-weight: 400;
    font-size: 23px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
    span {
      color: #4bc785;
    }
  }
  @media (max-width: 1200px) {
    flex-direction: column;
  }
  @media (max-width: 800px) {
    .title {
      font-size: 30px;
      line-height: 1.2;
      margin-bottom: 22px;
    }
    .info {
      font-size: 18px;
      line-height: 1.2;
    }
  }
`;
