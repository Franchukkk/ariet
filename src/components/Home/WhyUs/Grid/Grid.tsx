import styled from "styled-components";
import { Card } from "./Card/Card";
import { LogoCard } from "./LogoCard";
import { Banner } from "./Banner";
import icon1 from "@/assets/img/diamand-1.png";
import icon2 from "@/assets/img/diamand-2.png";
import icon3 from "@/assets/img/diamand-3.png";
import icon4 from "@/assets/img/diamand-4.png";
import icon5 from "@/assets/img/diamand-5.png";
import icon6 from "@/assets/img/diamand-6.png";

const DATA = [
  {
    title: "Надёжность и \nдолговечность",
    icon: icon1,
    className: "bg-[#0D0C0C]",
  },
  { title: "Широкий ассортимент\nрешений", icon: icon2 },
  { title: "Оперативная\nдоставка", icon: icon3, className: "bg-[#0D0C0C]" },
  {
    title: "Индивидуальный\nподход к клиентам",
    icon: icon4,
    className: "bg-[#0D0C0C]",
  },
  { title: "Глобальное\nприсутствие", icon: icon5 },
  {
    title: "Маркетинговая\nподдержка\nпартнёров",
    icon: icon6,
    className: "bg-[#0D0C0C]",
  },
];

export const Grid = () => (
  <StyledGrid>
    <LogoCard />
    {DATA.map(({ title, icon, className }, i) => (
      <Card
        key={i}
        position={1 + i}
        title={title}
        icon={icon}
        className={className}
      />
    ))}
    <Banner />
  </StyledGrid>
);

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 317px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: 200px;
  }
`;
