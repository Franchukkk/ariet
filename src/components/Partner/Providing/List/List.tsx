import styled from "styled-components";
import { AdvantageCard } from "../../../AdvantageCard/AdvantageCard";
import icon1 from "@/assets/img/diamand-7.png";
import icon2 from "@/assets/img/diamand-8.png";
import icon3 from "@/assets/img/diamand-9.png";

const DATA = [
  {
    title: "уверенно выполнять\nсвою работу",
    icon: icon1,
  },
  {
    title: "использовать все\nрыночные возможности",

    icon: icon2,
  },
  {
    title:
      "обеспечить максимальное\nудовлетворение потребностей\nсвоих клиентов",
    icon: icon3,
  },
];

export const List = () => (
  <StyledList>
    {DATA.map(({ icon, title }, i) => (
      <AdvantageCard key={i} position={i + 1} icon={icon} title={title} />
    ))}
  </StyledList>
);

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
