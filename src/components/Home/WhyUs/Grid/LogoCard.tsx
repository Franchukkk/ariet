import styled from "styled-components";
import LogoSvg from "@/assets/img/outline-logo.svg";

export const LogoCard = () => (
  <StyledLogoCard>
    <LogoSvg aria-label="logo-svg" />
    <div>
      Сотрудничать с Ariet Power — <br /> значит выбирать стабильность, <br />
      поддержку и уверенность в <br /> каждом этапе работы.
    </div>
  </StyledLogoCard>
);

const StyledLogoCard = styled.div`
  padding: 43px 28px 26px 23px;
  font-weight: 200;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  img {
    margin-bottom: 34px;
    width: 107px;
  }
`;
