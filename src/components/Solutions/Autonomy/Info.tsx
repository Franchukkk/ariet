import styled from "styled-components";
import photo from "@/assets/img/solutions-autonomy.png";
import Image from "next/image";

export const Info = () => (
  <StyledInfo>
    <h4>Питание в течение часов и даже суток</h4>
    <p>
      ИБП Ariet для метро Берлина обеспечивает работу <br /> систем 60 минут
      после отключения.
      <Image src={photo} alt="solution-png" />
    </p>
  </StyledInfo>
);

const StyledInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 48px;
  h4 {
    font-weight: 400;
    font-size: 23px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #4bc785;
  }
  p {
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0%;
    text-transform: uppercase;
    img {
      margin: 20px 0 -90%;
    }
  }
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;
