"use client"
import styled from "styled-components"
import { Advantages } from "../../components/About/Advantages/Advantages"
import { Global } from "../../components/About/Global/Global"
import { Goal } from "../../components/About/Goal/Goal"
import { Hero } from "../../components/About/Hero/Hero"
import { Standarts } from "../../components/About/Standarts/Standarts"
import { Title } from "../../components/About/Title/Title"
import { Support } from "../../components/Support/Support"



export default function Page() {
  return (
  <StyledAbout>
    <Hero />
    <Goal />
    <Advantages />
    <Support />
    <Standarts />
    <Global />
    <Title />
    </StyledAbout>
  )
};

const StyledAbout = styled.div`
  .support-wrapper {
    padding-bottom: 0;
  }
  .support-title {
    text-align: left;
    br {
      display: block;
    }
  }
  .planet-wrapper {
    top: 230px;
  }
`;
