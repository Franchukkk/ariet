import styled from "styled-components";
import IconSvg from "@/assets/img/delete-x.svg";

interface Props {
  title: string;
  onClick: () => void;
}
export const Tag = ({ title, onClick }: Props) => (
  <StyledTag className="flex items-center gap-2.5">
    {title}
    <button onClick={onClick}>
      <IconSvg aria-label="delete tag" />
    </button>
  </StyledTag>
);

const StyledTag = styled.div`
  border-radius: 6px;
  background: #242424;
  padding: 9px 14px 9px 15px;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffffcf;
`;
