'use client'
import styled from "styled-components"
import { Form } from "../../components/Form/Form"
import { LightPlanet } from "../../components/LightPlanet/LightPlanet"
import { Advantages } from "../../components/Partner/Advantages/Advantages"
import { Hero } from "../../components/Partner/Hero/Hero"
import { Providing } from "../../components/Partner/Providing/Providing"
import { What } from "../../components/Partner/What/What"

export default function Page() {
  return (
  <StyledPartner className="main-wrapper">
    <Hero />
    <What />
    <Providing />
    <Advantages />
    <LightPlanet />
    <Form />  
    </StyledPartner>
  )
};

const StyledPartner = styled.div``;
