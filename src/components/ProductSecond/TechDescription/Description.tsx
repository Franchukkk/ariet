import React from 'react'
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Description = () => {
  const { t } = useTranslation("common");

  const specs = [
    { label: t("description.type"), value: t("description.type_value") },
    { label: t("description.power"), value: t("description.power_value") },
    { label: t("description.voltage_form"), value: t("description.voltage_form_value") },
    { label: t("description.batteries"), value: t("description.batteries_value") },
    { label: t("description.efficiency"), value: t("description.efficiency_value") },
    { label: t("description.input_voltage"), value: t("description.input_voltage_value") },
    { label: t("description.output_voltage"), value: t("description.output_voltage_value") },
    { label: t("description.connection"), value: t("description.connection_value") },
  ];

  return (
    <StyledDescription>
      {specs.map(({ label, value }, i) => (
        <React.Fragment key={i}>
          <div className="label">{label}</div>
          <div className="value">{value}</div>
        </React.Fragment>
      ))}
    </StyledDescription>
  );
};

const StyledDescription = styled.div`
  display: grid;
  grid-template-columns: 192px 1fr;
  gap: 16px 22px;
  position: relative;

  &::before {
    content: "";
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    width: 50px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(0, 0, 0, 1) 100%
    );
    position: absolute;
  }

  .label {
    font-family: TT Firs Neue;
    font-weight: 100;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ffffff80;
  }

  .value {
    font-family: TT Firs Neue;
    font-weight: 300;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffc9;
    border-bottom: 1px solid #ffffff80;
    padding-bottom: 15px;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
