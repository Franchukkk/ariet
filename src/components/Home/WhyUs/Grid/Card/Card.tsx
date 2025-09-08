"use client";
import Image, { StaticImageData } from "next/image"
import type { ComponentType, SVGProps } from "react"
import styled from "styled-components"
import { Position } from "./Position"
import { Title } from "./Title"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type IconProp = IconComponent | StaticImageData | string;

interface Props {
  position: number;
  title: string;
  icon: IconProp;           
  className?: string;
}

export const Card = ({ position, title, icon, className }: Props) => {
  const isUrl = typeof icon === "string";
 

  function isStaticImage(icon: IconProp): icon is StaticImageData {
  return typeof icon === "object" && "src" in icon;
}




  const IconComp = icon as IconComponent;

  return (
    <StyledCard className={`${className ?? ""} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <Position position={position} />
       {isStaticImage(icon) || typeof icon === "string" ? (
  <Image src={icon} alt="icon" width={28} height={28} />
) : (
  <IconComp aria-label="icon" />
)}

      </div>
      <Title title={title} />
    </StyledCard>
  );
};


const StyledCard = styled.div`
  padding: 28px 26px 53px 37px;
  img {
    height: 35px;
  }
`;
