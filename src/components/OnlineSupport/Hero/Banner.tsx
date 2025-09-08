import styled from "styled-components";
import photo from "@/assets/img/tables.png";
import Image from "next/image";

export const Banner = () => (
  <StyledBanner>
    <Image src={photo} alt="tablets" />
  </StyledBanner>
);

const StyledBanner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  img {
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    width: 909px;
    height: 511px;
    object-fit: cover;
    @media (max-width: 1450px) {
      height: 400px;
    }
    @media (max-width: 1400px) {
      height: 380px;
    }
    @media (max-width: 1350px) {
      height: 330px;
    }
    @media (max-width: 1300px) {
      display: none;
    }
  }
`;
