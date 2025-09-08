import Link from "next/link";
import LogoSvg from "@/assets/img/logo.svg";
import styled from "styled-components";

export const Logo = () => (
  <StyledLogo
    href="/"
    className="bg-white rounded-[15px] pt-[13px] pb-2.5 px-[26px] shrink-0"
  >
    <LogoSvg aria-label="logo" />
  </StyledLogo>
);

const StyledLogo = styled(Link)`
  @media (max-width: 1500px) {
    img {
      width: 120px;
    }
  }
`;
