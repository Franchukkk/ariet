import styled from "styled-components";

interface Props {
  description: string;
}

export const Description = ({ description }: Props) => (
  <StyledDescription>{description}</StyledDescription>
);

const StyledDescription = styled.p`
  font-weight: 200;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  white-space: pre-wrap;
  color: #ffffffa8;
`;
