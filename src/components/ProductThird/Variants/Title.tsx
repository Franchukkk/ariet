import IconSvg from "@/assets/img/vatiant.svg"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return (
    <StyledTitle className="flex items-center gap-[13px]">
      <IconSvg aria-label="icon" />
      {t("ups.select_product_variant")}
    </StyledTitle>
  );
};

const StyledTitle = styled.div`
  font-weight: 300;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0%;
  margin-bottom: 24px;
`;
