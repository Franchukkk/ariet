import styled from "styled-components";

interface Props {
  onClick?: () => void;
}

export const ShowMore = ({ onClick }: Props) => (
  <StyledShowMore onClick={onClick}>Показать больше</StyledShowMore>
);

const StyledShowMore = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  padding: 20px 78px 18px;
  width: max-content;
  margin: 45px auto 27px;
  border: 1px solid #1dcf94;
  border-radius: 61px;
  font-weight: 500;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  transition: all 0.3s;
  &:hover {
    background: #1dcf94;
  }
`;
