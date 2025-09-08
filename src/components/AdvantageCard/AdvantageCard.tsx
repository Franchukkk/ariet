import { StaticImageData } from 'next/dist/shared/lib/image-external'
import Image from "next/image"
import type { ComponentType, SVGProps } from "react"
import React from 'react'
import styled from "styled-components"
import { Description } from "./Description"
import { Position } from "./Position"
import { Title } from "./Title"

type IconProp = ComponentType<SVGProps<SVGSVGElement>> | StaticImageData | string;

interface Props {
  position: number;
  icon: IconProp;
  title: string;
  description?: string;
}

export const AdvantageCard = ({
  position,
  icon,
  title,
  description,
}: Props) => {
  const isSvg = typeof icon === "function"
  const isImg = typeof icon === "object" && "src" in icon

  return (
    <StyledAdvantageCard>
      <Position position={position} />
      {isSvg ? (
        React.createElement(icon as ComponentType<SVGProps<SVGSVGElement>>, { "aria-label": title })
      ) : (
        <Image
          src={icon as string | StaticImageData}
          alt={title}
          width={76}
          height={76}
        />
      )}
      <Title title={title} />
      {description ? <Description description={description} /> : null}
    </StyledAdvantageCard>
  )
}

const StyledAdvantageCard = styled.div`
  padding: 50px 55px 56px 43px;
  background: #0d0c0c;
  border-radius: 8px;
  img {
    width: 76px;
    margin-bottom: 50px;
  }
  @media (max-width: 1000px) {
    padding: 30px 20px 30px 20px;
    img {
      margin-bottom: 30px;
    }
  }
`
