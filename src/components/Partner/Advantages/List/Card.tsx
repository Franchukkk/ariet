import styled from "styled-components"

interface Props {
  title: string;
  description: string;
}

export const Card = ({ title, description }: Props) => (
  <StyledCard>
    <h3>{title}</h3>
    <div className="divider"></div>
    <p>{description}</p>
  </StyledCard>
);

const StyledCard = styled.div`
  h3 {
    font-family: TT Firs Neue;
    font-weight: 500;
    font-size: 17px;
    line-height: 100%;
    letter-spacing: 1%;
    text-transform: uppercase;
  }
  .divider {
    margin: 37px 0 28px;
    width: 100%;
    height: 1px;
    background: #1dcf94;
    box-shadow: 0px -2px 5.4px 0px #1dcf94;
  }
  p {
    font-weight: 200;
    font-size: 14px;
    line-height: 25px;
    letter-spacing: 1%;
    color: #ffffffa8;
  }
`;
