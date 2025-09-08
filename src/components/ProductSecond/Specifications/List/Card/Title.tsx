import styled from "styled-components";

interface Props {
  title: string;
}

export const Title = ({ title }: Props) => <StyledTitle>{title}</StyledTitle>;

const StyledTitle = styled.h3`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 28px;
  max-width: 250px;
  @media (max-width: 700px) {
    max-width: 190px;
  }
`;
