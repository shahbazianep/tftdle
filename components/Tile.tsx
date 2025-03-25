export default function Tile({
    guess,
    correctValue,
}: {
    guess: number | string | string[];
    correctValue: number | string | string[];
}) {
    return (
        <div
            className={`w-20 h-20 ${
                guess.constructor === Array &&
                guess.some(
                    (element) =>
                        Array.isArray(correctValue) &&
                        correctValue.includes(element)
                )
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
