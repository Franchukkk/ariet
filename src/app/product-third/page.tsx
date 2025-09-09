"use client"
import { Categories } from "../../components/Categories/Categories"
import { Autonomy } from "../../components/ProductThird/Autonomy/Autonomy"
import { Galery } from "../../components/ProductThird/Galery/Galery"
import { Hero } from "../../components/ProductThird/Hero/Hero"
import { Models } from "../../components/ProductThird/Models/Models"
import { Possibilities } from "../../components/ProductThird/Possibilities/Possibilities"
import { Specifications } from "../../components/ProductThird/Specifications/Specifications"
import { Steps } from "../../components/ProductThird/Steps/Steps"
import { TechnicalInfo } from "../../components/ProductThird/TechnicalInfo/TechnicalInfo"
import { Variants } from "../../components/ProductThird/Variants/Variants"

export default function Page() {
  return (
  <div>
    <Variants />
    <Hero />
    <Steps />
    <Specifications />
    <Autonomy />
    <Possibilities />
    <Galery />
    <TechnicalInfo />
    <Models />
    <Categories />
    </div>
  )
};
