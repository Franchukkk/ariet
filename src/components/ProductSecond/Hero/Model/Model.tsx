import styled from "styled-components";
import IconSvg from "@/assets/img/3d.svg";
import model from "@/assets/img/3d-model.png";
import Image from "next/image";

export const Model = () => (
  <StyledModel>
    <div className="flex items-center gap-2.5 title">
      <IconSvg aria-label="icon" /> 3d model
    </div>
    <Image src={model} alt="3d model" className="model" />
  </StyledModel>
);

const StyledModel = styled.div`
  padding: 26px 31px;
  border-radius: 8px;
  background: #000000;
  .title {
    font-weight: 400;
    font-size: 15px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #ffffff5e;
  }
  .model {
    width: 380px;
    margin: 5px auto 0;
  }
  @media (max-width: 800px) {
    .model {
      width: 200px;
    }
  }
`;
