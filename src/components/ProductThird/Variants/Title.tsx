import styled from "styled-components";
import IconSvg from "@/assets/img/vatiant.svg";

export const Title = () => (
  <StyledTitle className="flex items-center gap-[13px]">
    <IconSvg aria-label="icon" />
    Выберите вариацию товара
  </StyledTitle>
);

const StyledTitle = styled.div`
  font-weight: 300;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0%;
  margin-bottom: 24px;
`;
