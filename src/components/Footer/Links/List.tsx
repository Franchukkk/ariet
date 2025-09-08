import Link from "next/link"
import styled from "styled-components"

interface Props {
  title: string;
  links: { title: string; link: string }[];
}

export const List = ({ title, links }: Props) => (
  <StyledList>
    <div className="title">{title}</div>
    <div className="flex flex-col gap-[7px]">
      {links.map(({ title, link }, i) => (
        <Link key={i} href={link}>
          {title}
        </Link>
      ))}
    </div>
  </StyledList>
);

const StyledList = styled.div`
  margin-left: 77px;
  width: 200px;
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 16px;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #f1f1f1;
    margin-bottom: 23px;
  }
  a {
    font-weight: 300;
    font-size: 17px;
    line-height: 25.5px;
    letter-spacing: 0%;
    color: #f2f2f2a8;
    transition: all 0.3s;
    &:hover {
      color: #4bc785;
    }
  }
  @media (max-width: 1200px) {
    margin-left: 0;
  }
  @media (max-width: 1000px) {
    margin-bottom: 40px;
    .title {
      font-size: 18px;
    }
    a {
      font-size: 14px;
    }
  }
`;
