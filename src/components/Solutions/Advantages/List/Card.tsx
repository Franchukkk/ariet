import styled from "styled-components";

interface Props {
  position: number;
  title: string;
}

export const Card = ({ position, title }: Props) => (
  <StyledCard>
    <div className="position">{position}</div>
    <div className="title">{title}</div>
    <div className="divider"></div>
  </StyledCard>
);

const StyledCard = styled.div`
  .position {
    display: flex;
    align-items: center;
    padding: 4.5px 19.5px;
    height: 28px;
    border-radius: 11111px;
    border: 1px solid #ffffff57;
    font-weight: 200;
    font-size: 15px;
    line-height: 100%;
    letter-spacing: 1%;
    text-transform: uppercase;
    color: #ffffff9c;
    margin-bottom: 30px;
    width: max-content;
  }
  .title {
    font-weight: 500;
    font-size: 17px;
    line-height: 100%;
    letter-spacing: 1%;
    text-transform: uppercase;
    height: 81px;
    white-space: pre-wrap;
  }
  .divider {
    width: 100%;
    height: 1px;
    background: #1dcf94;
    box-shadow: 0px -2px 5.4px 0px #1dcf94;
  }
`;
