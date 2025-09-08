import styled from "styled-components";
import photo from "@/assets/img/galery-img.png";
import SearchIcon from "@/assets/img/search.svg";
import BorderSvg from "@/assets/img/galery-border.svg";
import Image from "next/image";

export const Card = () => (
  <StyledCard>
    <BorderSvg aria-label="border" className="card-border" />
    <div className="card">
      <SearchIcon aria-label="search-icon" className="search-icon" />
      <Image src={photo} alt="some image? Who knows" />
    </div>
  </StyledCard>
);

const StyledCard = styled.div`
  position: relative;
  padding: 36px 42px;
  height: 519px;
  width: 437px;
  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 36px 50px 23px;
    background: #0d0c0c;
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    .search-icon {
      position: absolute;
      top: 22px;
      right: 23px;
      width: 20px;
      height: 20px;
      opacity: 0;
      transition: all 0.3s;
    }
    &:hover {
      .search-icon {
        opacity: 1;
      }
    }
  }
  .card-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: saturate(0);
  }
  &:hover {
    .card-border {
      filter: saturate(1);
    }
  }
  @media (max-width: 800px) {
   height: 302px;
        width: 258px;
        padding: 20px;
  }
`;
