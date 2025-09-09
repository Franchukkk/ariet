"use client";

import { useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Checkbox } from "../Checkbox"
import { Button } from "./Button"
import { Input } from "./Input"
import { Title } from "./Title"

interface Props {
  title?: string;
}

export const Form = ({ title }: Props) => {
  const { t } = useTranslation("common");
  const [checkbox, setCheckbox] = useState(false);

  const formTitle = (title ?? t("Form.fill_form")).replace("\\n", "\n");

  return (
    <StyledForm>
      <Title title={formTitle} />

        <div className="fields">
        <div className="fields-group">
          <Input label={t("Form.name")} />
          <Input label={t("Form.position")} />
        </div>
        <div className="fields-group">
          <Input label={t("Form.phone")} />
          <Input label={t("Form.email")} />
        </div>
        <Input label={t("Form.address")} />
        <div className="fields-group">
          <Input label={t("Form.zip")} />
          <Input label={t("Form.city")} />
        </div>
        <Input label={t("Form.country")} />
        <Input label={t("Form.message")} textarea />
      </div>

      <Checkbox
        label={t("Form.is_company")}
        checked={checkbox}
        onChange={() => setCheckbox(!checkbox)}
      />
      <Button />
    </StyledForm>
  );
};

const StyledForm = styled.div`
  max-width: 768px;
  margin: 0 auto 111px;
  .fields {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    gap: 44px;
    margin-bottom: 44px;
  }
  .fields-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 38px;
  }
  @media (max-width: 800px) {
    .fields-group {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
`;
