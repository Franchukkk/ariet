import styled from "styled-components";

interface Props {
  title: string;
}

export const Title = ({ title }: Props) => <StyledTitle>{title}</StyledTitle>;

const StyledTitle = styled.h4`
  font-weight: 500;
  font-size: 17px;
  line-height: 120%;
  letter-spacing: 1%;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;
