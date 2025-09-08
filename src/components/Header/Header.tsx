"use client";

import styled from "styled-components";
import { Burger } from "./Burger";
import { Catalog } from "./Catalog/Catalog";
import { Contacts } from "./Contacts/Contacts";
import { Logo } from "./Logo";
import { Message } from "./Message/Message";
import { Navigation } from "./Navigation";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);

  const handleToggleSidebar = () => {
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = open ? "auto" : "hidden";
    }
    setOpen(!open);
  };
  return (
    <StyledHeader className="main-wrapper flex items-center gap-1.5 !mb-5">
      <Logo />
      <div
        className={`header-content flex items-center gap-1.5 ${open && "open"}`}
      >
        <Catalog />
        <Navigation />
        <Contacts />
        <Message />
      </div>
      <Burger open={open} onToggle={handleToggleSidebar} />
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  @media (max-width: 1300px) {
    .header-content {
      display: none;
      &.open {
        display: flex;
        position: fixed;
        top: 90px;
        left: 0;
        bottom: 0;
        right: 0;
        background: #000000;
        display: grid;
        grid-template-columns: 1fr max-content;
        grid-auto-rows: max-content;
        gap: 20px;
        z-index: 100;
        padding: 20px;
      }
    }
  }
`;
