import styled from "styled-components";

interface Props {
  title: string;
  type?: string;
}

export const Button = ({ title, type }: Props) => (
  <StyledButton className={type}>{title}</StyledButton>
);

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 430px;
  height: 58px;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0%;
  text-align: center;
  color: #121212;
  border-radius: 61px;
  margin-bottom: 19px;
  background: #4bc785;
  border: 1px solid #4bc785;
  transition: all 0.3s;
  &:hover {
    background: #fff;
  }
  &.light {
    background: #fff;
    &:hover {
      background: #4bc785;
    }
  }
  @media (max-width: 800px) {
    width: 100%;
    font-size: 14px;
  }
`;
