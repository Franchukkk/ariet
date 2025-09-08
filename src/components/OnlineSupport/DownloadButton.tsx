import styled from "styled-components";
import IconSvg from "@/assets/img/guide.svg";

export const DownloadButton = () => (
  <StyledDownloadButton className="flex items-center justify-center gap-[15px]">
    Скачать гайд <IconSvg aria-label="download guide" />
  </StyledDownloadButton>
);

const StyledDownloadButton = styled.button`
  padding: 15px 73px;
  height: 58px;
  font-weight: 500;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  border: 1px solid #1dcf94;
  border-radius: 61px;
  margin: 0 auto 73px;
  transition: all 0.3s;
  &:hover {
    background: #1dcf94;
  }
`;
