import styled from "styled-components";
import { Text } from "./Text";
import { Button } from "./Button";
import { Background } from "./Background";

export const Description = () => (
  <StyledDescription className="flex flex-col justify-between">
    <Text />
    <Button />
    <Background />
  </StyledDescription>
);

const StyledDescription = styled.div`
  padding: 53px 30px 62px 70px;
  position: relative;
  overflow: hidden;
  @media (max-width: 1200px) {
    padding: 30px;
    height: 500px;
  }
`;
