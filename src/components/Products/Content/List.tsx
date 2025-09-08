import styled from "styled-components";
import { ModelCard } from "../../../components/ModelCard/ModelCard";
import { IProduct } from "./Content";
import React from "react";

interface Props {
  data: IProduct[];
}

export const List = ({ data }: Props) => {
  const renderModelCards = (data: IProduct[]) => {
    return data.reduce((acc: any, _, index) => {
      if (index % 2 !== 0) return acc;

      const first = data[index];
      const second = data[index + 1];

      acc.push(
        <React.Fragment key={index}>
          <>
            <div className="card card-border">
              <ModelCard
                photo={first.photo}
                title={first.title}
                category={first.category}
                link={first.link}
              />
            </div>
            {second && (
              <div className="card">
                <ModelCard
                  photo={second.photo}
                  title={second.title}
                  category={second.category}
                  link={second.link}
                />
              </div>
            )}
          </>
          <div className="divider" />
        </React.Fragment>
      );

      return acc;
    }, []);
  };

  return <StyledList>{renderModelCards(data)}</StyledList>;
};

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: max-content;
  .divider {
    grid-column: 1/3;
    height: 1px;
    border-top: 1px dashed #ffffff80;
    margin: 14px 0;
  }
  .card {
    &.card-border {
      border-right: 1px dashed #ffffff80;
    }
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    .card {
      border-bottom: 1px dashed #ffffff80;
      border-right: none !important;
    }
    .divider {
      grid-column: 1/2;
      display: none;
    }
  }
`;
