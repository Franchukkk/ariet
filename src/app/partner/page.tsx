import styled from "styled-components";
import { Hero } from "../../components/Partner/Hero/Hero";
import { What } from "../../components/Partner/What/What";
import { Providing } from "../../components/Partner/Providing/Providing";
import { Advantages } from "../../components/Partner/Advantages/Advantages";
import { LightPlanet } from "../../components/LightPlanet/LightPlanet";
import { Form } from "../../components/Form/Form";

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
