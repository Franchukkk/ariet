"use client";

import { Background } from "@/components/About/Hero/Background";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function Registration() {
    const { t } = useTranslation("common");
    return (
        <RegistrationWrapper >
            <StyledTitle>{t("title.registration")}</StyledTitle>
            <RegistrationForm />
            <CanvasBlock>
                <Background />
            </CanvasBlock>
        </RegistrationWrapper>
    )
}

const RegistrationWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0px;
    overflow: hidden;
`;

const StyledTitle = styled.h1`
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;  
  color: #ffffff;
  margin-bottom: 80px;

  @media (max-width: 800px) {
    text-align: center;
  }
`;

const CanvasBlock = styled.div`
   transform: rotate(-24deg);
    position: absolute;
    left: 150px;
    top: -252px;
    width: 204%;
    height: 174%;
    z-index: -2;
    overflow: hidden;
`;