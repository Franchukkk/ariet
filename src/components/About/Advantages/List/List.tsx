"use client";
import icon1 from "@/assets/img/diamand-7.png"
import icon2 from "@/assets/img/diamand-8.png"
import icon3 from "@/assets/img/diamand-9.png"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

const DATA = [
  { icon: icon1, key: "advantages.peace_of_mind_and_confidence" },
  { icon: icon2, key: "advantages.fast_delivery_and_support" },
  { icon: icon3, key: "advantages.ups_configurator" },
];

export const List = () => {
  const { t } = useTranslation("common");

  const AdvantageItem = ({
    icon,
    title,
    description,
    number,
  }: {
    icon: string;
    title: string;
    description: string;
    number: string;
  }) => (
    <StyledItem>
      <NumberCircle>{number}</NumberCircle>
      <img src={icon} alt={title} />
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }} />
    </StyledItem>
  );

  return (
    <StyledList>
      {DATA.map(({ icon, key }, i) => (
        <AdvantageItem
          key={i}
          icon={icon.src}
          title={t(key)}
          description={t(`${key}_description`)}
          number={`0${i + 1}`}
        />
      ))}
    </StyledList>
  );
};

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const StyledItem = styled.div`
  position: relative;
  background: #111;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;

  img {
    display: block;
    margin: 0 auto 16px auto;
    width: 64px;
    height: 64px;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    color: #ccc;
    line-height: 1.5;
  }
`;

const NumberCircle = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: #222; // фон номера
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
