import styled from "styled-components";
import { ModelCard } from "@/components/ModelCard/ModelCard";
import productImg from "@/assets/img/module.png";

export const List = () => (
  <StyledList>
    <div className="card">
      <ModelCard
        photo={productImg}
        title="Онлайн ИБП ARIET "
        category="Однофазные ИБП"
        link="/"
      />
    </div>
    <div className="card">
      <ModelCard
        photo={productImg}
        title="Онлайн ИБП ARIET "
        category="Однофазные ИБП"
        link="/"
      />
    </div>
    <div className="card no-border">
      <ModelCard
        photo={productImg}
        title="Онлайн ИБП ARIET "
        category="Однофазные ИБП"
        link="/"
      />
    </div>
    <div className="divider" />
    <div className="card">
      <ModelCard
        photo={productImg}
        title="Онлайн ИБП ARIET "
        category="Однофазные ИБП"
        link="/"
      />
    </div>
    <div className="card">
      <ModelCard
        photo={productImg}
        title="Онлайн ИБП ARIET "
        category="Однофазные ИБП"
        link="/"
      />
    </div>
    <div className="card no-border">
      <ModelCard
        photo={productImg}
        title="Онлайн ИБП ARIET "
        category="Однофазные ИБП"
        link="/"
      />
    </div>
  </StyledList>
);

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px dashed #ffffff50;
  border-top: 1px dashed #ffffff50;
  margin-bottom: 34px;
  padding: 12px 0;
  .divider {
    grid-column: 1/4;
    grid-row: 2/3;
    border-bottom: 1px dashed #ffffff50;
    margin: 14px 0;
  }
  .card {
    border-right: 1px dashed #ffffff50;
    border-radius: 0;
    padding: 13px 11px;
    &.no-border {
      border-right: none;
    }
  }
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    border-bottom: none;
    .divider {
      display: none;
    }
    .card {
      border-bottom: 1px dashed #ffffff50;
      border-right: none;
      &:last-child() {
        border-bottom: none;
      }
    }
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
