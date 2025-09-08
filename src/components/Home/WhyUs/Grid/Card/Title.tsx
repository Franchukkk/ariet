import styled from "styled-components";

interface Props {
  title: string;
}

export const Title = ({ title }: Props) => (
  <StyledTitle className="flex items-center">
    <div />
    <span>{title}</span>
  </StyledTitle>
);

const StyledTitle = styled.div`
  gap: 17px;
  white-space: pre-wrap;
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  letter-spacing: 1%;
  text-transform: uppercase;

  div {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    background: #1dcf94;
    border: 3px solid #e1e1e1;
  }
`;
