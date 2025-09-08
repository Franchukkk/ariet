'use client'
import { Categories } from "../../components/Categories/Categories"
import { Autonomy } from "../../components/ProductSecond/Autonomy/Autonomy"
import { Hero } from "../../components/ProductSecond/Hero/Hero"
import { Kit } from "../../components/ProductSecond/Kit/Kit"
import { Models } from "../../components/ProductSecond/Models/Models"
import { Possibilities } from "../../components/ProductSecond/Possibilities/Possibilities"
import { SmartControl } from "../../components/ProductSecond/SmartControl/SmartControl"
import { Specifications } from "../../components/ProductSecond/Specifications/Specifications"
import { Steps } from "../../components/ProductSecond/Steps/Steps"
import { TechDescription } from "../../components/ProductSecond/TechDescription/TechDescription"

export default function Page() {
  return (
  <div>
    <Hero />
    <Steps />
    <Specifications />
    <Autonomy />
    <Possibilities />
    <SmartControl />
    <TechDescription />
    <Kit />
    <Models />
    <Categories />
    </div>
  )
};
