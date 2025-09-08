import styled from "styled-components";

export const Subtitle = () => (
  <StyledSubtitle>
    Присоединяйтесь к партнёрской программе для профессионалов в <br /> области
    энергорешений
  </StyledSubtitle>
);

const StyledSubtitle = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #4bc785;
  margin-bottom: 86px;
    @media (max-width: 800px) {
        margin-bottom: 30px;
    }
`;
