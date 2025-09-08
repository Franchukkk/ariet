import type { FunctionComponent, SVGProps } from "react"
import styled from "styled-components"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
}

export const Card = ({ step, icon: Icon, title, ...props }: Props) => (
  <StyledCard {...props} className="flex flex-col justify-center gap-[48px]">
    <div className="step">0{step}</div>
    <Icon aria-label="icon" />
    <div>{title}</div>
  </StyledCard>
);

const StyledCard = styled.div`
  padding: 31px;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 1%;
  text-transform: uppercase;
  color: #ffffffc4;
  position: relative;
  border-left: 1px dashed #ffffff45;

  &:last-child {
    border-right: 1px dashed #ffffff45;
  }

  img {
    width: 40px;
    height: 40px;
  }

  .step {
    display: flex;
    align-items: center;
    padding: 4.5px 19.5px;
    background: #000000;
    border: 1px solid #ffffff57;
    border-radius: 11111px;
    font-weight: 200;
    font-size: 15px;
    width: max-content;
    position: absolute;
    top: -34px;
    left: 31px;
  }

  @media (max-width: 1000px) {
    border-left: none;
    border-top: 1px dashed #ffffff45;
    align-items: center;
    padding: 25px;

    &:last-child {
      border-right: none;
    }

    .step {
      left: 50%;
      transform: translateX(-50%);
      top: -14px;
    }
  }
`;
