"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  useSpring, useTransform, useMotionValue,
} from "framer-motion";

type Answer = { label: string; points: number };

type CalcContextType = {
  answers: Record<string, Answer>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, Answer>>>;
  total: number;
  answered: number;
  progress: number;
  passed: boolean;
  pct: number;
  animatedTotal: any;
  reset: () => void;
};

const QUESTIONS_COUNT = 12;
const PASS_MARK = 65;

function useAnimatedCounter(target: number) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 100, damping: 22 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  useMemo(() => { motionVal.set(target); }, [target, motionVal]);
  return rounded;
}

const CalcContext = createContext<CalcContextType | null>(null);

export function CalcProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const total = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b.points, 0),
    [answers],
  );
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / QUESTIONS_COUNT) * 100);
  const passed = total >= PASS_MARK;
  const pct = Math.min(100, (total / PASS_MARK) * 100);
  const animatedTotal = useAnimatedCounter(total);
  const reset = () => setAnswers({});

  return (
    <CalcContext.Provider value={{
      answers, setAnswers,
      total, answered, progress,
      passed, pct, animatedTotal, reset,
    }}>
      {children}
    </CalcContext.Provider>
  );
}

export function useCalc() {
  const ctx = useContext(CalcContext);
  if (!ctx) throw new Error("useCalc must be used inside CalcProvider");
  return ctx;
}