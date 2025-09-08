import styled from "styled-components";

interface Props {
  onClick: () => void;
}

export const CleanButton = ({ onClick }: Props) => (
  <StyledCleanButton onClick={onClick}>Очистить фильтр</StyledCleanButton>
);

const StyledCleanButton = styled.button`
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0%;
  text-decoration: underline;
  color: #ffffffcf;
  white-space: nowrap;
`;
