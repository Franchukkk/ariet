"use client";

import Image, { StaticImageData } from "next/image"
import type { ComponentType, SVGProps } from "react"
import styled from "styled-components"

type Props = {
  title: string;
  icon?: StaticImageData | ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
};

export const Card = ({ title, icon: Icon, className }: Props) => {
  return (
    <StyledCard className={className}>
      <div className="title">{title}</div>

      {Icon ? (
        typeof Icon === "function" ? (
          <Icon aria-hidden="true" focusable="false" />
        ) : (
          <Image src={Icon} alt={title} width={64} height={64} />
        )
      ) : null}
    </StyledCard>
  );
};

const StyledCard = styled.div`
  border: 1px solid #313131;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 12px;

  .title {
    font-weight: 600;
    font-size: 16px;
    text-align: center;
  }

  &.outline-card {
    border: 2px dashed #4bc785;
  }
`;
