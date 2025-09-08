import styled from "styled-components"

interface Props {
  path: string[];
}

export const Breadcrumbs = ({ path }: Props) => (
  <StyledBreadcrumbs className="flex items-center gap-3">
    {path.map((item, i) => (
      <span key={i} className="flex items-center gap-3">
        {i > 0 && <span>{">"}</span>}
        <span>{item}</span>
      </span>
    ))}
  </StyledBreadcrumbs>
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
