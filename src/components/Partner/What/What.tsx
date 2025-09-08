import styled from "styled-components";
import { Title } from "./Title";
import { Text } from "./Text";

export const What = () => (
  <StyledWhat className="flex justify-between">
    <Title />
    <Text />
  </StyledWhat>
);

const StyledWhat = styled.div`
  margin-bottom: 49px;
  @media(max-width: 1100px) {
    flex-direction: column;
    gap: 20px;
  }
`;
