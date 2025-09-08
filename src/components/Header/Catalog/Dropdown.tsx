import Link from "next/link"
import styled from "styled-components"

const LINKS = [
  {
    title: "Commercial",
    items: [
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
    ],
  },
  {
    title: "Commercial",
    items: [
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
    ],
  },
  {
    title: "Commercial",
    items: [
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
    ],
  },
  {
    title: "Commercial",
    items: [
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
      { title: "Category", link: "/" },
    ],
  },
];

export const Dropdown = () => {
  return (
    <StyledDropdown className="dropdown">
      {LINKS?.map(({ title, items }, i) => (
        <div key={i}>
          <div className="group-title">{title}</div>
          <div className="flex flex-col gap-3">
            {items?.map((link, j) => (
              <Link key={j} href={link.link}>{link.title}</Link>
            ))}
          </div>
        </div>
      ))}
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  width: 400px;
  background: #000000;
  left: 0;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #f2f2f2;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 100;
  .group-title {
    margin-bottom: 10px;
    font-size: 12px;
    color: #ffffff70;
  }
  a:hover {
    color: #4bc785;
  }
`;
