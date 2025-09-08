import styled from "styled-components";
import { Text } from "./Text";
import photo from "@/assets/img/network-map.png";
import Image from "next/image";

export const Network = () => (
  <StyledNetwork>
    <Image src={photo} alt="network map" />
    <Text />
  </StyledNetwork>
);

const StyledNetwork = styled.div`
  img {
    width: 100%;
    height: 515px;
    margin-bottom: 33px;
    object-fit: cover;
    object-position: right;
  }
  @media (max-width: 1200px) {
    padding-bottom: 30px;
    img {
      height: 400px;
      margin-bottom: 40px;
    }
  }
  @media (max-width: 800px) {
    img {
      height: 200px;
      margin-bottom: 20px;
    }
  }
`;
