import styled from "styled-components";

interface Props {
  active: boolean;
  onClick: () => void;
}

export const ToggleButton = ({ active, onClick }: Props) => (
  <StyledToggleButton onClick={onClick}>
    {active ? "Скрыть" : "Отобразить"} фильтры
  </StyledToggleButton>
);

const StyledToggleButton = styled.button`
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0%;
  text-decoration: underline;
  color: #ffffffcf;
  white-space: nowrap;
  display: none;
  @media (max-width: 1100px) {
    display: flex;
  }
`;
