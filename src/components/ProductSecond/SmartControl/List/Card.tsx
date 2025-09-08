import styled from "styled-components";
import photo from "@/assets/img/card.png";
import Image from "next/image";

export const Card = () => (
  <StyledCard>
    <div className="banner">
      <Image src={photo} alt="Карта SNMP" />
    </div>
    <div className="content">
      <div className="title">Карта SNMP</div>
      <p className="descr">
        Подключение к вашей системе мониторинга <br /> и управления с
        возможностью получать <br /> данные в реальном времени.
      </p>
    </div>
  </StyledCard>
);

const StyledCard = styled.div`
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #121212;
    border-radius: 8px;
    height: 140px;
    padding: 10px 50px;
    margin-bottom: 26px;
    img {
      height: 100%;
      object-fit: contain;
    }
  }
  .content {
    padding-top: 34px;
    border-top: 1px dashed #1dcf94;
  }
  .title {
    font-weight: 500;
    font-size: 17px;
    line-height: 100%;
    letter-spacing: 1%;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .descr {
    font-family: TT Firs Neue;
    font-weight: 200;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
  }
`;
