import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Card = ({ active }: { active?: boolean }) => {
  const { t } = useTranslation("common");

  return (
    <StyledCard className={`${active ? "active" : ""}`}>
      <div className="title">{t("ups.ups_model")}</div>
      <div className="subtitle">{t("ups.ups_power")}</div>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  padding: 25px 20px 13px;
  background: #0d0c0c;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s;
  flex-shrink: 0;

  .title {
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 1%;
    text-transform: uppercase;
    color: #ffffffc4;
    margin-bottom: 8px;
  }
  .subtitle {
    font-weight: 300;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
  }

  &.active,
  &:hover {
    border: 1px solid #1dcf94;
    box-shadow: 0px 9px 20.9px 0px #1dcf9440;
  }
`;
