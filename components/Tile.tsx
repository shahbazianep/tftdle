import { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export default function Tile({
	guess,
	correctValue,
	field = "",
	hintsEnabled = false,
}: {
	guess: number | string | string[];
	correctValue: number | string | string[];
	field?: string;
	hintsEnabled?: boolean;
}) {
	const [fontSize, setFontSize] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined" && Array.isArray(guess)) {
			const maxLength = Math.max(
				...guess.map((entry) => entry.length || 0)
			);
			const isMobile = window.matchMedia("(max-width: 767px)").matches;
			const base = isMobile ? 17 : 22;
			const size = Math.max(base - maxLength, 6);
			setFontSize(`${size}px`);
		}
	}, [guess]);

	return (
		<div
			className={`relative w-12 h-12 sm:w-20 text-[10px] sm:text-base sm:h-20 flex flex-col items-center justify-center rounded-lg sm:rounded-2xl text-center font-[Beatrice-Medium] z-0 cursor-default ${
				guess === correctValue
					? "bg-[#A3C751]"
					: Array.isArray(guess) &&
					  Array.isArray(correctValue) &&
					  guess.some((element) => correctValue.includes(element))
					? "bg-[#FFB131]"
					: "bg-[#E25C5C]"
			}`}
			style={{
				fontSize: fontSize,
			}}
		>
			{["set", "cost", "range"].includes(field) &&
				guess < correctValue &&
				hintsEnabled && (
					<IoMdArrowDropup
						size={24}
						className="text-[#AD3F3F] absolute left-1/2 top-0 -translate-x-1/2"
					/>
				)}
			{Array.isArray(guess)
				? guess.map((g, index) => <div key={index}>{g}</div>)
				: guess}
			{["set", "cost", "range"].includes(field) &&
				guess > correctValue &&
				hintsEnabled && (
					<IoMdArrowDropdown
						size={24}
						className="text-[#AD3F3F] absolute left-1/2 bottom-0 -translate-x-1/2"
					/>
				)}
		</div>
	);
}
