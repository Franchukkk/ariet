import styled from "styled-components";
import Image, {StaticImageData} from "next/image";

interface Props {
  title: string;
  photo: string | StaticImageData;
}

export const Card = ({ title, photo }: Props) => (
  <StyledCard>
    <Image src={photo} alt={title} />
    <div>{title}</div>
  </StyledCard>
);

const StyledCard = styled.div`
  img {
    width: 100%;
    height: 240px;
    border-radius: 8px;
    margin-bottom: 13px;
    object-fit: cover;
      @media (max-width: 800px) {
        height: 160px;
      }
  }
  div {
    padding: 26px 10px 28px;
    background: #0d0c0c;
    border-radius: 8px;
    white-space: pre-wrap;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 17px;
    line-height: 100%;
    letter-spacing: 1%;
    text-align: center;
    text-transform: uppercase;
    line-height: 1.2;
  }
`;
