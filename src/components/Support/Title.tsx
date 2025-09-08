import styled from "styled-components";

export const Title = () => (
  <StyledTitle className="main-wrapper support-title">
    <div className="support-title">
      Техническая <br /> поддержка и <br /> сопровождение
    </div>
  </StyledTitle>
);

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  text-align: center;
  margin-bottom: 53px;
  br {
    display: none;
  }
  @media (max-width: 1000px) {
    font-size: 30px;
    line-height: 1.2;
    margin-bottom: 30px;
  }
`;
