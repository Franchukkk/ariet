import styled from "styled-components";

interface Props {
  subtitle: string;
}

export const Subtitle = ({ subtitle }: Props) => (
  <StyledSubtitle>{subtitle}</StyledSubtitle>
);

const StyledSubtitle = styled.div`
  max-width: 300px;
  font-weight: 200;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
  margin-bottom: 72px;
  white-space: pre-wrap;
  @media (max-width: 700px) {
    max-width: 194px;
  }
`;
