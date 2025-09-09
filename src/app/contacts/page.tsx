"use client"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Breadcrumbs } from "../../components/Breadcrumbs"
import { Location } from "../../components/Contacts/Location"
import { Title } from "../../components/Contacts/Title"
import { Form } from "../../components/Form/Form"

export default function Page() {
  const { t } = useTranslation("common")

  return (
    <StyledContacts className="main-wrapper">
      
      <Breadcrumbs
        path={[
          t("breadcrumbs.home"),
          t("breadcrumbs.products"),
          t("breadcrumbs.online_ups")
        ]}
      />
      <Title />
      <Location />
      <Form />
    </StyledContacts>
  )
}

const StyledContacts = styled.div``
