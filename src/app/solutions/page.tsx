import styled from "styled-components";
import { Hero } from "../../components/Solutions/Hero/Hero";
import { Parameters } from "../../components/Solutions/Parameters/Parameters";
import { Advantages } from "../../components/Solutions/Advantages/Advantages";
import { MaterialTitle } from "../../components/Solutions/MaterialTitle";
import { Autonomy } from "../../components/Solutions/Autonomy/Autonomy";
import { LightPlanet } from "../../components/LightPlanet/LightPlanet";
import { Form } from "../../components/Form/Form";

export default function Page() {
  return (
  <StyledSolutions className="main-wrapper">
    <Hero />
    <Parameters />
    <Advantages />
    <MaterialTitle />
    <Autonomy />
    <LightPlanet />
    <Form title={`Расскажите нам о своей задаче`} />
    </StyledSolutions>
  )
};

const StyledSolutions = styled.div``;
