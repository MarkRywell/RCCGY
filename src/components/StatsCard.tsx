import { IconContext } from "react-icons";

type StatsCardProps = {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    /** Small text beside the value (e.g. '+', 'km', '/wk') */
    unit?: string;
};


function StatsCard({ icon, title, value, unit }: StatsCardProps) {
    const formattedValue = typeof value === "number" ? new Intl.NumberFormat().format(value) : value;

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