import styled from "styled-components";
import BurgerIcon from "@/assets/img/burger.svg";
import CloseIcon from "@/assets/img/close.svg";

interface Props {
  open: boolean;
  onToggle: () => void;
}

export const Burger = ({ open, onToggle }: Props) => (
  <StyledBurger
    type="button"
    onClick={onToggle}
    aria-label={open ? "Close menu" : "Open menu"}
    aria-expanded={open}
  >
    {open ? <CloseIcon aria-hidden="true" className="icon" /> : <BurgerIcon aria-hidden="true" className="icon" />}
  </StyledBurger>
);

const StyledBurger = styled.button`
  display: none;
  border: 1px dashed #4bc785;
  border-radius: 15px;
  padding: 10px;
  height: 56px;
  width: 56px;
  img {
    width: 24px;
    height: 24px;
  }
  @media (max-width: 1300px) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }
`;
