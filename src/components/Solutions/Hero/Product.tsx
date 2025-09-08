import styled from "styled-components";
import photo from "../../../assets/img/solutions-img.png";
import Image from "next/image";

export const Product = () => (
  <StyledProduct>
    <Image src={photo} alt="product" />
  </StyledProduct>
);

const StyledProduct = styled.div`
  position: relative;
  @media (max-width: 1200px) {
    display: none;
  }
`;
