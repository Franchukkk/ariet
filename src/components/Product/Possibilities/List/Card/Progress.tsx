"use client";

import { useEffect, useState } from "react"

interface Props {
  progress: number;
}

export const Progress = ({ progress = 0 }: Props) => {
  const [size, setSize] = useState(0);

  useEffect(() => {
    const updateSize = () => setSize(window.innerWidth > 1000 ? 370 : 300);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!size) return null;

  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * progress) / 100;

  return (
    <svg
      width={size}
      height={size}
      style={{
        transform: "rotate(-90deg)",
        transformOrigin: "center",
        display: "block",
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#292929"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1dcf94"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.5s ease",
          filter: "drop-shadow(0px 0px 6px #1dcf94)",
        }}
      />
    </svg>
  );
};
