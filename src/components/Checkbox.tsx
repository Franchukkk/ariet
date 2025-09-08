"use client";

import styled from "styled-components";
import IconSvg from "../assets/img/checkbox.svg";


import { useState } from "react";

interface Props {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
}

export const Checkbox = ({ checked, onChange, label }: Props) => (
  <StyledCheckbox
    className={`flex items-center gap-4 ${checked ? "active" : ""}`}
    onClick={onChange}
  >
    <div>{checked ? <IconSvg aria-label="checkbox" /> : null}</div>
    {label}
  </StyledCheckbox>
);

const StyledCheckbox = styled.div`
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffffcf;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #c7c7c7;
  }
  &.active div {
    background: #4bc785;
    border: 1px solid #4bc785;
  }
`;
