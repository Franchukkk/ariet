"use client";

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Progress } from "./Progress"

interface Props {
  title: string;
  subtitle: string;
  progress: number;
}

export const Card = ({ title, subtitle }: Props) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startIncreasing = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 10);
  };

  const startDecreasing = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 10);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <StyledCard
      className="flex flex-col justify-center"
      onMouseEnter={startIncreasing}
      onMouseLeave={startDecreasing}
    >
      <Progress progress={progress} />
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
    </StyledCard>
  );
};
const StyledCard = styled.div`
  width: 370px;
  height: 370px;
  border-radius: 100%;
  padding: 51px 50px 0 63px;
  margin-top: 5px;
  position: relative;
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 370px;
    height: 370px;
  }
  @media (max-width: 1000px) {
    width: 300px;
    height: 300px;
    padding: 20px;
    text-align: center;
    svg {
      width: 300px;
      height: 300px;
    }
  }
  .title {
    font-weight: 400;
    font-size: 17px;
    line-height: 130%;
    letter-spacing: 1%;
    text-transform: uppercase;
    margin-bottom: 17px;
  }
  .subtitle {
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    color: #ffffffa8;
  }
`;
