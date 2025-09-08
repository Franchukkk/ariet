import styled from "styled-components";
import { Title } from "./Title";
import { Text } from "./Text";

export const Parameters = () => (
  <StyledParameters className="flex justify-between">
    <Title />
    <Text />
  </StyledParameters>
);

const StyledParameters = styled.div`
  margin-bottom: 120px;
  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 20px;
  }
`;
