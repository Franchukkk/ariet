"use client"

import styled from "styled-components"
import userAdministrator from "@/assets/img/user_administrator.png"
import bg from "@/assets/img/user-bg.png";
import edit from "@/assets/img/edit.png";
import { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";
import corner from "@/assets/img/corner.png";
import cornerDown from "@/assets/img/corner2.png";

type ImgLike = string | StaticImageData;

const userData =
{
    name: "Ирина ",
    second_name: "Овчаренко",
    role: "Адміністратор",
    value: "John Doe",
    promocode: "OVCHARENKO200",
};

export const UserAdminInfo = () => {
    const { t } = useTranslation("common");

    return (
        <UserWrapper $bg={bg} className="mr-[20px] max-w-[321px]">
            <WrapperDiv className="bg-[#0D0C0C] rounded-[8px] w-[300px] py-[30px] text-center flex flex-col items-center">
                <ImgDiv className="relativemb-[20px] w-[231px] h-[231px] rounded-full overflow-hidden mb-[11px]">
                    <img src={userAdministrator.src} alt="user-administrator" />
                    <img className="w-[68px] h-[68px] absolute top-[30px] right-[40px]" src={edit.src} alt="edit" />
                </ImgDiv>
                <NamePerson className="text-[#FFFFFF] text-[18px] leading-[27px] font-bold">{userData.second_name} {userData.name}</NamePerson>
                <p className="mb-[20px] text-[#FFFFFF] text-[20px] leading-[27px] font-bold">{userData.role}</p>
                <p className="mb-[20px] text-[#FFFFFF] text-[18px] leading-[27px] font-bold">{t("AdminDashboard.my_promocode")}</p>
                <p className="px-[20px] py-[10px] border border-[#4BC785] rounded-[10px] text-[#FFFFFF] font-[300] text-[18px] leading-[27px] font-bold">{userData.promocode}</p>
            </WrapperDiv>
            <Corner className="absolute top-0 left-0 rotate-180" src={cornerDown.src} alt="corner" />
            <Corner className="absolute top-0 right-0 rotate-180" src={corner.src} alt="corner" />
            <Corner className="absolute bottom-0 left-0" src={corner.src} alt="corner" />
            <Corner className="absolute bottom-0 right-0" src={cornerDown.src} alt="corner" />

        </UserWrapper>
    )
}

const Corner = styled.img`
   width: 45px;
   height: 65px;
`

const UserWrapper = styled.div<{ $bg: ImgLike }>`
    position: relative;
    padding: 10px;
    @media (max-width: 600px) {
        max-width: 280px;
    }
`

const NamePerson = styled.p`
    display: inline-block;
    font-size: 25px;
    line-height: 30px;
    font-weight: 600;
    color: #FFFFFF;
    text-transform: uppercase;
    margin-bottom: 20px;
`

const ImgDiv = styled.div`
    @media (max-width: 600px) {
        width: 200px;
        height: 200px;
    }
`

const WrapperDiv = styled.div`
    @media (max-width: 600px) {
        width: 250px;
    }
`