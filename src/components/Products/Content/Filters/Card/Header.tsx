import styled from "styled-components";
import ArrowSvg from "@/assets/img/filter-arrow.svg";

interface Props {
  title: string;
  open: boolean;
  onToggleOpen: () => void;
}

export const Header = ({ title, open, onToggleOpen }: Props) => (
  <StyledHeader
    className={`flex items-center justify-between ${open ? "open" : ""}`}
    onClick={onToggleOpen}
  >
    <span>{title}</span>
    <ArrowSvg aria-label="arrow" />
  </StyledHeader>
);

const StyledHeader = styled.div`
  font-weight: 400;
  font-size: 18.2px;
  line-height: 100%;
  letter-spacing: 0%;
  margin-bottom: 26px;
  cursor: pointer;
  user-select: none;
  img {
    transform: rotate(180deg);
    transition: all 0.3s;
  }
  &.open {
    img {
      transform: rotate(0deg);
    }
  }
`;
