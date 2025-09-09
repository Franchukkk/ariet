import IconSvg from "@/assets/img/swipe-icon.svg"
import { useTranslation } from 'react-i18next'
import styled from "styled-components"

interface Props {
  active: number;
  nextSlide: string;
  total: number;
}

export const Footer = ({ active, total, nextSlide }: Props) => {
  const { t } = useTranslation("common");

  return (
    <StyledFooter className="flex items-center gap-2">
      {1 + active}{" "}
      <span>
        / {total} {total === 1 + active ? "" : t("title.next")}{" "}
      </span>
      {total === 1 + active ? null : (
        <>
          {nextSlide} <IconSvg aria-label="icon" />
        </>
      )}
    </StyledFooter>
  );
};


const StyledFooter = styled.div`
  position: absolute;
  left: 37px;
  bottom: 17px;
  font-weight: 300;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #fff;
  z-index: 3;
  span {
    color: #ffffff4d;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;
