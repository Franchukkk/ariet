"use client"

import { useTranslation } from "react-i18next"
import styled from "styled-components";

export const TitleAdminDashboard = () => {
    const { t } = useTranslation("common");

    return (
        <StyledTitle className="mt-[95px] leading-[58px] text-[50px] uppercase font-[600] text-[#FFFFFF] mb-[36px]">{t("AdminDashboard.title")}</StyledTitle>
    )
}

const StyledTitle = styled.h1`
@media (max-width: 1000px) {
    font-size: 30px;
    line-height: 35px;
    margin-bottom: 20px;
    margin-top: 35px;
}

 @media (max-width: 600px) {
        text-align: center;
    }
`