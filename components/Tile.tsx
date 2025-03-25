import { Champion } from "@/assets/types/types";

export default function Tile({
    guess,
    correctValue,
}: {
    guess: any;
    correctValue: any;
}) {
    return (
        <div
            className={`w-20 h-20 ${
                guess.constructor === Array &&
                guess.some((element) => correctValue.includes(element))
                    ? "bg-[#FFB131]"
                    : guess === correctValue
                    ? "bg-[#A3C751]"
                    : "bg-[#E25C5C]"
            } flex flex-row items-center justify-center rounded-2xl text-center`}
        >
            {guess.constructor === Array ? guess.join("\n") : guess}
        </div>
    );
}
