import styled from "styled-components";

export const Button = () => <StyledButton>Каталог продукции</StyledButton>;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  border-radius: 61px;
  border: 1px solid #4bc785;
  width: 100%;
  transition: all 0.3s;
  &:hover {
    background: #4bc785;
  }
`;
