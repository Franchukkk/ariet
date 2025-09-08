"use client";

import IconSvg from "@/assets/img/pin.svg"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

const KEYS = [
  "List.barcelona_spain",
  "List.izmir_turkey",
  "List.shenzhen_china",
] as const;

const ListItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2.5">
    <IconSvg aria-label="icon" />
    {text}
  </li>
);

export const List = () => {
  const { t } = useTranslation("common");

  return (
    <StyledList>
      {KEYS.map((key) => (
        <ListItem key={key} text={t(key)} />
      ))}
    </StyledList>
  );
};

const StyledList = styled.ul`
  margin: 25px 0 22px;
  font-family: TT Firs Neue;
  font-weight: 300;
  font-size: 16px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
`;
