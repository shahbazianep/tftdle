export default function Switch({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div
            className={`w-24 h-10 flex items-center justify-start rounded-full p-1.5 cursor-pointer transition-all duration-300 relative mt-2 mb-2 ${
                !checked ? "bg-[#D78383]" : "bg-[#BDD783]"
            }`}
            onClick={() => onChange(!checked)}
        >
            <div
                className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    !checked ? "translate-x-14" : "translate-x-0"
                }`}
            ></div>
            {
                <span
                    className={`select-none absolute font-[Beatrice-Medium] text-[10px] text-[#AD3F3F] left-4 duration-300 transition-opacity ease-in-out ${
                        !checked ? "opacity-100 delay-120" : "opacity-0"
                    }`}
                >
                    HARD
                </span>
            }
            {
                <span
                    className={`select-none absolute font-[Beatrice-Medium] text-[10px] text-[#6A7947] right-2 duration-300 transition-opacity ease-in-out ${
                        checked ? "opacity-100 delay-120" : "opacity-0"
                    }`}
                >
                    NORMAL
                </span>
            }
        </div>
    );
}
