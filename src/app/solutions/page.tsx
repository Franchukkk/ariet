"use client"
import styled from "styled-components"
import { Form } from "../../components/Form/Form"
import { LightPlanet } from "../../components/LightPlanet/LightPlanet"
import { Advantages } from "../../components/Solutions/Advantages/Advantages"
import { Autonomy } from "../../components/Solutions/Autonomy/Autonomy"
import { Hero } from "../../components/Solutions/Hero/Hero"
import { MaterialTitle } from "../../components/Solutions/MaterialTitle"
import { Parameters } from "../../components/Solutions/Parameters/Parameters"

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
