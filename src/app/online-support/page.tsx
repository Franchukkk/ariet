import styled from "styled-components";
import { Hero } from "../../components/OnlineSupport/Hero/Hero";
import { DownloadButton } from "../../components/OnlineSupport/DownloadButton";
import { Form } from "../../components/Form/Form";

export default function Page() {
  return (
  <StyledOnlineSupport className="main-wrapper">
    <Hero />
    <DownloadButton />
    <Form title={`Заполните форму\nрегистрации`} />
    </StyledOnlineSupport>
  )
};

const StyledOnlineSupport = styled.div``;
