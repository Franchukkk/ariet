import styled from "styled-components";

interface Props {
  title: string;
  description: string;
}

export const Card = ({ title, description }: Props) => (
  <StyledCard>
    <div className="title">{title}</div>
    <p className="description">{description}</p>
  </StyledCard>
);

const StyledCard = styled.div`
  .title {
    font-weight: 600;
    font-size: 77px;
    line-height: 88px;
    letter-spacing: 1%;
    color: transparent;
    -webkit-text-stroke: 0.8px #fff;
  }
  .description {
    font-weight: 100;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
    white-space: pre-wrap;
  }
`;
