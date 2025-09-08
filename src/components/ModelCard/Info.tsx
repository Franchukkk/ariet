import styled from "styled-components";
import Arrow from "@/assets/img/link-arrow.svg";

interface Props {
  title: string;
  category: string;
}

export const Info = ({ title, category }: Props) => (
  <StyledInfo className="flex items-end justify-between ">
    <div>
      <div className="category">{category}</div>
      <div className="title">{title}</div>
    </div>
    <div className="link-btn">
      <Arrow aria-label="icon"/>
    </div>
  </StyledInfo>
);

const StyledInfo = styled.div`
  .category {
    font-weight: 400;
    font-size: 13px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #7f7f7f;
    margin-bottom: 12px;
  }
  .title {
    font-weight: 600;
    font-size: 17px;
    line-height: 100%;
    letter-spacing: 1%;
  }
  .link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 0.59px solid #d9d9d940;
    border-radius: 4px;
    transition: all 0.3s;
    svg {
      margin-left: 2px;
    }
  }
`;
