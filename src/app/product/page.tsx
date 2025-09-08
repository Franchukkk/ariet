import { Categories } from "../../components/Categories/Categories";
import { Autonomy } from "../../components/Product/Autonomy/Autonomy";
import { Hero } from "../../components/Product/Hero/Hero";
import { Models } from "../../components/Product/Models/Models";
import { Possibilities } from "../../components/Product/Possibilities/Possibilities";
import { Specifications } from "../../components/Product/Specifications/Specifications";
import { Steps } from "../../components/Product/Steps/Steps";
import { TechnicalInfo } from "../../components/Product/TechnicalInfo/TechnicalInfo";

export default function Page() {
  return (
  <div>
    <Hero />
    <Steps />
    <Specifications />
    <Autonomy />
    <Possibilities />
    <TechnicalInfo />
    <Models />
    <Categories />
    </div>
  )
};
