import styled from "styled-components";


const LANGS = [
  { code: "en", label: "ENG" },
  { code: "ru", label: "РУС" },
] as const;

type Lang = (typeof LANGS)[number]["code"]; 

type Props = {
  current: Lang;
  onSelect: (lng: Lang) => void;
};

export const Dropdown = ({ current, onSelect }: Props) => {
  
  const ordered =
    current === "en" ? ([LANGS[1], LANGS[0]] as const) : ([LANGS[0], LANGS[1]] as const);

  return (
    <StyledDropdown className="dropdown" role="listbox">
      {ordered.map(({ code, label }) => (
        <div
          key={code}
          role="option"
          aria-selected={current === code}
          aria-disabled={current === code}
          onClick={(e) => {
            e.stopPropagation();
            if (code === current) return;
            onSelect(code); 
          }}
          style={{ opacity: current === code ? 0.6 : 1 }}
        >
          {label}
        </div>
      ))}
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  width: 52px;
  background: #000000;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #f2f2f2;
  text-align: left;
  transition: all .3s;
  opacity: 0;
  visibility: hidden;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    height: 34px;
    &:hover {
      background: #181818;
    }
  }
`;
