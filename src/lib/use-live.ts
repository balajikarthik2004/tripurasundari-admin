import { useEffect, useState } from "react";

export function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

export function useTick(intervalMs = 5000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(i);
  }, [intervalMs]);
  return tick;
}

export function useJitter(base: number, variance: number, intervalMs = 5000) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const i = setInterval(() => {
      setV(() => Math.max(0, Math.round(base + (Math.random() - 0.5) * 2 * variance)));
    }, intervalMs);
    return () => clearInterval(i);
  }, [base, variance, intervalMs]);
  return v;
}
