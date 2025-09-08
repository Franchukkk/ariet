import styled from "styled-components";

export const Title = () => (
  <StyledTitle>
    В состав ИБП входят{" "}
    <b>6 мощных аккумуляторов серии HR ёмкостью по 14 Ач каждый</b>. <br />
    <br /> Это премиальное решение, рассчитанное на стабильную и длительную
    работу даже в условиях повышенной нагрузки.
  </StyledTitle>
);

const StyledTitle = styled.div`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 95px;
  b {
    color: #4bc785;
    font-weight: 500;
  }
  @media (max-width: 800px) {
    font-size: 18px;
    line-height: 140%;
    margin-bottom: 40px;
  }
`;
