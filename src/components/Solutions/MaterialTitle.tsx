import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const MaterialTitle = () => {
  const { t } = useTranslation("common");

  return (
    <StyledMaterialTitle
      dangerouslySetInnerHTML={{ __html: t("ups.material_title") }}
    />
  );
};

const StyledMaterialTitle = styled.h2`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-align: right;
  text-transform: uppercase;
  margin-bottom: 105px;
  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 1.2;
  }
`;
