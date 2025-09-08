import styled from "styled-components"

interface Props {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
}

export const Button = ({ children, onClick, active }: Props) => (
  <StyledButton onClick={onClick} className={active ? "active" : ""}>
    {children}
  </StyledButton>
);

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
  transition: all 0.3s;
  &:hover,
  &.active {
    color: #1dcf94;
    border: 1px solid #1dcf94;
    path {
      fill: #1dcf94;
    }
  }
`;
