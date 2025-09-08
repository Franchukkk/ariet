import styled from "styled-components";
import { Card } from "./Card";
import photo1 from "@/assets/img/category-1.png";
import photo2 from "@/assets/img/category-2.png";
import photo3 from "@/assets/img/category-3.png";
import photo4 from "@/assets/img/category-4.png";
import photo5 from "@/assets/img/category-5.png";

export const Grid = () => (
  <StyledGrid>
    <Card
      className="card row-span-2"
      topTitle="Inverter"
      bottomTitle="Inverter"
      photo={photo1}
    />
    <Card
      className="card row-span-2"
      topTitle="UPS"
      bottomTitle="UPS"
      photo={photo2}
    />
    <Card
      className="card col-start-3 col-end-5"
      bottomTitle="Voltage Regulator"
      photo={photo3}
    />
    <Card
      className="card row-start-2 row-end-3 col-start-3 col-end-5"
      bottomTitle="MDC"
      photo={photo4}
    />
    <Card
      className="card col-start-5 col-end-8 row-span-2"
      bottomTitle="Batteries"
      photo={photo5}
    />
  </StyledGrid>
);

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 165px;
  gap: 12px;
  .card {
    &:nth-child(1),
    &:nth-child(2) {
      .card-product {
        width: 250px;
        height: 356px;
        top: 82.88px;
        right: 54px;
      }
      .card-footer {
        .title {
          display: none;
        }
      }
    }
    &:nth-child(3),
    &:nth-child(4) {
      .card-product {
        width: 250px;
        height: 356px;
        top: 8px;
        left: 0px;
      }
    }
    &:nth-child(3) {
      .title {
        max-width: 122px;
      }
    }
    &:nth-child(4) {
      .title {
        margin-right: 74px;
      }
    }
    &:nth-child(5) {
      .card-product {
        width: 346px;
        height: 495px;
        top: 29px;
        left: -60px;
      }
    }
  }
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    .card {
      grid-column: unset !important;
      grid-row: unset !important;
      .title {
        display: none;
      }
      .card-footer {
        .title {
          display: block !important;
          margin: 0 !important;
          max-width: max-content !important;
        }
      }
      .card-product {
        left: -90px !important;
        top: 10px !important;
        width: 300px !important;
      }
    }
  }
`;
