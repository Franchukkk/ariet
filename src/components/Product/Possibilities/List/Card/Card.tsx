"use client";

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Progress } from "./Progress"

interface Props {
  title: string;
  subtitle: string;
  progress?: number;
}

export const Card = ({ title, subtitle, progress = 0 }: Props) => {
  const [progressState, setProgress] = useState(progress);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const changeProgress = (delta: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev = 0) => {
        const next = prev + delta;
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          return 100;
        }
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return next;
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
      onMouseEnter={() => changeProgress(1)}
      onMouseLeave={() => changeProgress(-1)}
    >
      <Progress progress={progressState} />
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
    width: 100%;
    height: 100%;
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
