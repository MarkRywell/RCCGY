import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconContext } from "react-icons";

type StatsCardProps = {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    /** Small text beside the value (e.g. '+', 'km', '/wk') */
    unit?: string;
    /** Enable count-up animation for numeric values. */
    animate?: boolean;
    /** Duration of the count-up animation in milliseconds. Defaults to 2000ms. */
    durationMs?: number;
};

function StatsCard({ icon, title, value, unit, animate = false, durationMs = 2000 }: StatsCardProps) {
    const isNumberValue = typeof value === "number";
    const shouldAnimate = animate && isNumberValue;
    const startValue = 1;
    const [displayValue, setDisplayValue] = useState<number>(() => (isNumberValue ? startValue : 0));
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!shouldAnimate) return;

        const target = value as number;
        const duration = Math.max(durationMs, 0);
        let startTime: number | null = null;

        const tick = (now: number) => {
            if (startTime === null) {
                startTime = now;
                setDisplayValue(startValue);
            }

            const elapsed = now - startTime;
            const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
            const current = Math.round(startValue + (target - startValue) * progress);
            setDisplayValue(current);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [shouldAnimate, value, durationMs]);

    const resolvedValue = shouldAnimate ? displayValue : value;

    const formattedValue = useMemo(() => {
        if (typeof resolvedValue !== "number") return resolvedValue;
        const safeNumber = Number.isNaN(resolvedValue) ? 0 : resolvedValue;
        return new Intl.NumberFormat().format(safeNumber);
    }, [resolvedValue]);

    return (
        <>
            <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-white text-center">
                <IconContext.Provider value={{ color: "#ff3600", size: "1em" }}>
                    <span className="text-[3em] sm:text-[5em] md:text-[4em]">{icon}</span>
                </IconContext.Provider>
                <p className="font-bold text-xl sm:text-2xl flex items-baseline gap-1">
                    <span>{formattedValue}</span>
                    {unit ? <span className="text-sm font-semibold opacity-90">{unit}</span> : null}
                </p>
                <p className="font-semibold sm:text-base text-sm text-gray-300">{title}</p>
            </div>
        </>
    )
}

export default StatsCard;
