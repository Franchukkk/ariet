
import styled from "styled-components"
import { Breadcrumbs } from "../../components/Breadcrumbs"
import { Location } from "../../components/Contacts/Location"
import { Title } from "../../components/Contacts/Title"
import { Form } from "../../components/Form/Form"

export default function Page() {
  return (
  <StyledContacts className="main-wrapper">
    <Breadcrumbs path={["Главная", "Продукция", "Онлайн ИБП Ariet T3K"]} />
    <Title />
    <Location />
    <Form />
    </StyledContacts>
  )
};

const StyledContacts = styled.div``;
