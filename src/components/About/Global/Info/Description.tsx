import styled from "styled-components";

interface Props {
  text: string;
  className?: string;
}

export const Description = ({ text, className }: Props) => (
  <StyledDescription className={className}>{text}</StyledDescription>
);

const StyledDescription = styled.p`
  font-weight: 200;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
  white-space: pre-wrap;
`;
