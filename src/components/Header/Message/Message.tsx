import styled from "styled-components";
import IconSvg from "@/assets/img/message.svg";

export const Message = () => (
  <StyledMessage>
    <IconSvg aria-label="contact message" />
  </StyledMessage>
);

const StyledMessage = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 24px;
  border-radius: 15px;
  background: #4bc785;
  height: 62px;
  width: 73px;
  flex-shrink: 0;
  @media (max-width: 1400px) {
    width: 60px;
    padding: 10px;
  }
`;
