"use client";

import { useState } from "react";
import styled from "styled-components";

interface Props {
  label: string;
  textarea?: boolean;
}

export const Input = ({ label, textarea }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <StyledInput className={`${focused && "active"}`}>
      <div className="label">{label}</div>
      {textarea ? (
        <textarea
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        ></textarea>
      ) : (
        <input
          type="text"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </StyledInput>
  );
};

const StyledInput = styled.div`
  .label {
    color: #7f7f7f;
    font-weight: 400;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
  }
  input,
  textarea {
    font-weight: 400;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
    border-bottom: 1px solid #ffffff8a;
    width: 100%;
    background: none;
    outline: none;
    padding: 5px 0;
  }
  textarea {
    resize: none;
    height: 60px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &.active {
    .label {
      color: #1dcf94;
    }
    input,
    textarea {
      border-bottom: 1px solid #1dcf94;
    }
  }
`;
