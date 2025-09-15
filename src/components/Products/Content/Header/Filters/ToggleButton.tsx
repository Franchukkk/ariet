import { useTranslation } from "react-i18next"
import styled from "styled-components"

interface Props {
  active: boolean;
  onClick: () => void;
}

export const ToggleButton = ({ active, onClick }: Props) => {
  const { t } = useTranslation("common");

  return (
    <StyledToggleButton onClick={onClick}>
      {active ? t("filters.hide") : t("filters.show")} {t("filters.title")}
    </StyledToggleButton>
  );
};

const StyledToggleButton = styled.button`
  font-weight: 300;
  font-size: 14px;
  font-weight: 400;
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
