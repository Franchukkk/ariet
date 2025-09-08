import styled from "styled-components";

interface Props {
  title: string;
  subtitle: string;
}

export const Card = ({ title, subtitle }: Props) => (
  <StyledCard className="flex items-center gap-[28px]">
    <div className="dot"></div>
    <div>
      <b>{title}</b> <span>{subtitle}</span>
    </div>
  </StyledCard>
);

const StyledCard = styled.div`
  padding: 20px 131px 21px 26px;
  background: #0d0c0c;
  border-radius: 8px;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
  span {
    font-weight: 200;
  }
  .dot {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    background: #1dcf94;
    border: 3px solid #e1e1e1;
  }
  @media (max-width: 1000px) {
    padding: 20px;
  }
`;
