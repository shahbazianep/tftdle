"use client";
import Image from "next/image";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
import { Champion } from "@/assets/types/types";
import Tile from "@/components/Tile";

export default function Home() {
    const [champs, setChamps] = useState<Champion[]>();
    const [answer, setAnswer] = useState<Champion>();
    const [guesses, setGuesses] = useState<number[]>([]);
    const [query, setQuery] = useState<string>("");
    const [filteredChamps, setFilteredChamps] = useState<Champion[]>();
    const [finished, setFinished] = useState<boolean>(false);

    useEffect(() => {
        const fetchChamps = async () => {
            const { data, error } = await supabase
                .from("champions")
                .select("*");
            if (!error) setChamps(data);
        };

        fetchChamps();
    }, []);

    useEffect(() => {
        if (champs) {
            setAnswer(champs[Math.floor(Math.random() * champs.length)]);
            setFilteredChamps(champs);
        }
    }, [champs]);

    return (
        champs &&
        filteredChamps &&
        answer && (
            <div
                className={`flex flex-col items-center justify-center min-h-screen w-full bg-[url(../assets/images/background.png)] bg-cover bg-fixed text-black ${
                    guesses.length === 0 ? "" : "pt-48"
                }`}
            >
                <Image src={"/logo.png"} height={500} width={500} alt="Logo" />
                <div className="text-white font-[Beatrice-Extrabold] text-4xl mt-10 mb-10">
                    Guess today&apos;s TFT champion!
                </div>
                <div className="flex flex-row w-1/2 justify-center items-center relative mb-4">
                    <input
                        className={`w-96 px-5 pr-16 h-12 bg-slate-50 ${
                            query === "" || filteredChamps.length === 0
                                ? "rounded-3xl"
                                : "rounded-t-3xl"
                        } focus:outline-none font-[Beatrice-Medium]`}
                        type="text"
                        name="search"
                        value={query}
                        autoCorrect="off"
                        autoComplete="off"
                        disabled={finished}
                        onChange={(e) => {
                            const newQuery = e.target.value;
                            setQuery(newQuery);
                            setFilteredChamps(
                                champs
                                    .filter((champ) => {
                                        return (
                                            champ.name
                                                .toLowerCase()
                                                .startsWith(newQuery) &&
                                            !guesses.includes(
                                                champs.indexOf(champ)
                                            )
                                        );
                                    })
                                    .sort((a, b) => {
                                        if (a.name > b.name) {
                                            return 1;
                                        } else if (a.name < b.name) {
                                            return -1;
                                        } else if (a.set > b.set) {
                                            return 1;
                                        } else {
                                            return -1;
                                        }
                                    })
                            );
                        }}
                    />
                    {query.length > 0 && filteredChamps.length > 0 ? (
                        <div className="absolute top-12 max-h-60 w-96 rounded-b-xl overflow-y-auto custom-scrollbar">
                            <div
                                className={`bg-slate-50 py-0 ${
                                    filteredChamps.length > 0 ? "" : "hidden"
                                }`}
                            >
                                {filteredChamps.map((champ, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="shrink-0 flex h-8 px-5 py-6 bg-slate-50 items-center focus:outline-none focus:bg-[#31217D]/30 hover:bg-[#31217D]/30 relative cursor-pointer"
                                            onClick={() => {
                                                setQuery("");
                                                setGuesses([
                                                    champs.indexOf(champ),
                                                    ...guesses,
                                                ]);
                                                setFinished(champ == answer);
                                            }}
                                        >
                                            <div className="w-8 h-8 relative mr-3 rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        champ.icon.startsWith(
                                                            "//"
                                                        )
                                                            ? "https:" +
                                                              champ.icon
                                                            : champ.icon
                                                    }
                                                    alt="Player Image"
                                                    height={32}
                                                    width={32}
                                                />
                                            </div>

                                            <span>
                                                {champ.name +
                                                    " - Set " +
                                                    champ.set}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden"></div>
                    )}
                </div>
                <div>
                    <div
                        className={`grid grid-cols-6 gap-2 p-4 text-white text-center ${
                            guesses.length === 0 ? "hidden" : ""
                        }`}
                    >
                        <text>NAME</text>
                        <text>SET</text>
                        <text>COST</text>
                        <text>GENDER</text>
                        <text>RANGE</text>
                        <text>TRAITS</text>
                    </div>
                    {guesses.map((guess) => {
                        const { set, cost, gender, range, traits, icon } =
                            champs[guess];
                        return (
                            <div
                                className="grid grid-cols-6 gap-2 mb-3 p-4 bg-[#31217D]/55 rounded-2xl text-white"
                                key={guess}
                            >
                                <div className="w-20 h-20 flex flex-row items-center justify-center rounded-2xl overflow-hidden">
                                    <Image
                                        src={
                                            icon.startsWith("//")
                                                ? "https:" + icon
                                                : icon
                                        }
                                        alt="Player Image"
                                        height={80}
                                        width={80}
                                    />
                                </div>
                                <Tile guess={set} correctValue={answer.set} />
                                <Tile guess={cost} correctValue={answer.cost} />
                                <Tile
                                    guess={
                                        { 0: "Male", 1: "Female", 2: "Other" }[
                                            gender
                                        ] || "Unknown"
                                    }
                                    correctValue={
                                        { 0: "Male", 1: "Female", 2: "Other" }[
                                            answer.gender
                                        ] || "Unknown"
                                    }
                                />
                                <Tile
                                    guess={range}
                                    correctValue={answer.range}
                                />
                                <Tile
                                    guess={traits}
                                    correctValue={answer.traits}
                                />
                            </div>
                        );
                    })}
                </div>
                <div></div>
                <div
                    className={`flex flex-col items-center justify-center gap-2 mt-16 mb-8 p-4 bg-[#31217D]/55 rounded-2xl text-white ${
                        guesses.length === 0 ? "hidden" : ""
                    }`}
                >
                    {"INDICATORS"}
                    <div className="grid grid-cols-5 gap-2 mb-3 text-white">
                        <Tile guess={"Correct"} correctValue={"Correct"} />
                        <Tile
                            guess={["Partial"]}
                            correctValue={["Partial", ""]}
                        />
                        <Tile guess={"Wrong"} correctValue={""} />
                        <Tile guess={"Higher"} correctValue={""} />
                        <Tile guess={"Lower"} correctValue={""} />
                    </div>
                </div>
                {finished && (
                    <div className="absolute top-0 left-0 w-screen h-screen bg-black/50 flex flex-row items-center justify-center text-center backdrop-blur-md">
                        <div className="left-1/2 top-1/2 bg-red-400 flex items-center justify-center py-24 px-24">
                            Congratulations! You took {guesses.length} guesses
                            to guess today&apos;s TFTdle champion: {answer.name}
                        </div>
                    </div>
                )}
            </div>
        )
    );
}
