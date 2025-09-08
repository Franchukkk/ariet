import styled from "styled-components"
import { Language } from "../Catalog//Language/Language"
import { Divider } from "./Divider"
import { Phone } from "./Phone"

export const Contacts = () => (
  <StyledContacts className="flex items-center">
    <Phone />
    <Divider />
    <Language />
  </StyledContacts>
);

const StyledContacts = styled.div`
  padding: 13px 18px 13px 20px;
  border: 1px dashed #ffffff;
  border-radius: 15px;
  height: 62px;
  flex-shrink: 0;
`;
