import styled from "styled-components";

interface Props {
  title: string;
}

export const Title = ({ title }: Props) => <StyledTitle>{title}</StyledTitle>;

const StyledTitle = styled.h1`
  font-weight: 600;
  font-size: 111px;
  line-height: 100%;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  position: relative;
  z-index: 2;
  text-align: center;
  margin: 0 34px 66px;
  @media (max-width: 700px) {
    font-size: 50px;
    margin: 0 10px 20px;
  }
`;
