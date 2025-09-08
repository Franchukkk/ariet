import styled from "styled-components";
import { addZero } from "@/helpers";

interface Props {
  position: number;
}

export const Position = ({ position }: Props) => (
  <StyledPosition>{addZero(position)}</StyledPosition>
);

const StyledPosition = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  padding: 4.5px 19.5px;
  border-radius: 11111px;
  border: 1px solid #ffffff57;
  font-weight: 300;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-transform: uppercase;
  color: #ffffff9c;
  height: 28px;
`;
