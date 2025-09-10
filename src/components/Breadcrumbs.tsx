import Link from "next/link";
import styled from "styled-components"

interface Props {
  path: string[];
  alias: string[];
}

export const Breadcrumbs = ({ path, alias }: Props) => (
  <>

    <StyledBreadcrumbs className="flex items-center gap-3 main-wrapper">
      {path.map((item, i) => {
        return (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && <span>{">"}</span>}
            {alias[i] === "current" ? <span>{item}</span> : <Link href={`/${alias[i]}`}>{item}</Link>}

          </span>)
      })}
    </StyledBreadcrumbs>
  </>

);

const StyledBreadcrumbs = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0%;
  color: #ffffff82;

  @media (max-width: 800px) {
    font-size: 12px;
    gap: 5px;
  }
`;
