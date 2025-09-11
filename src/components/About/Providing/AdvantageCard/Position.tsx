import styled from "styled-components";

interface Props {
  position: number;
}

export const Position = ({ position }: Props) => (
  <StyledPosition>{position}</StyledPosition>
);

const StyledPosition = styled.div`
  display: flex;
  align-items: center;
  padding: 4.5px 18px;
  height: 28px;
  border-radius: 11111px;
  border: 1px solid #ffffff57;
  color: #ffffff9c;
  font-weight: 200;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-transform: uppercase;
  margin-bottom: 80px;
  width: max-content;
  @media (max-width: 1000px) {
    margin-bottom: 40px;
  }
`;
