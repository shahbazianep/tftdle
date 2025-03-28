"use client";
import Image from "next/image";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
import { Champion, Stats } from "@/assets/types/types";
import Tile from "@/components/Tile";
import Head from "next/head";
import { IoIosStats } from "react-icons/io";
import { IoClose } from "react-icons/io5";

// const attributeWeights: { [key: string]: number } = {
//     set: 5, // Example: Set is relatively important
//     cost: 4, // Cost is somewhat important
//     gender: 3, // Gender is less differentiating
//     range: 1, // Range is moderately important
// };

export default function Home() {
    const [champs, setChamps] = useState<Champion[]>();
    const [answer, setAnswer] = useState<Champion>();
    const [guesses, setGuesses] = useState<number[]>([]);
    const [query, setQuery] = useState<string>("");
    const [filteredChamps, setFilteredChamps] = useState<Champion[]>();
    const [finished, setFinished] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
    const [resultsClosed, setResultsClosed] = useState<boolean>(false);
    const [showStats, setShowStats] = useState<boolean>(false);
    const [showIndicators, setShowIndicators] = useState<boolean>(true);
    const [stats, setStats] = useState<Stats>();
    // const [graph, setGraph] = useState<Graph>();
    // const [scores, setScores] = useState<number[]>();

    function getTimeUntilMidnight() {
        const now = new Date();
        const midnight = new Date();
        midnight.setDate(now.getDate());
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - now.getTime();

        return {
            seconds: Math.floor((timeUntilMidnight / 1000) % 60),
            minutes: Math.floor((timeUntilMidnight / (1000 * 60)) % 60),
            hours: Math.floor(timeUntilMidnight / (1000 * 60 * 60)),
        };
    }

    useEffect(() => {
        const fetchChamps = async () => {
            const { data, error } = await supabase
                .from("champions")
                .select("*");
            if (!error) setChamps(data);
        };

        fetchChamps();
        const timer = setInterval(() => {
            setTimeLeft(getTimeUntilMidnight());
        }, 1000);
        setStats(getStats);

        return () => clearInterval(timer);
    }, []);

    // const filterGraph = (graph: Graph, guess: Champion) => {
    //     const correctSet = guess.set === answer?.set;
    //     const correctCost = guess.cost === answer?.cost;
    //     const correctGender = guess.gender === answer?.gender;
    //     const correctRange = guess.range === answer?.range;
    //     const correctTraits =
    //         guess.traits === answer?.traits
    //             ? 2
    //             : guess.traits.some((trait) => answer?.traits.includes(trait))
    //             ? 1
    //             : 0;

    //     graph.edges.forEach((value, key, map) => {
    //         const champion = graph.nodes.find((champ) => champ.id === key);
    //         if (!champion) return;

    //         const isValid =
    //             correctSet === (champion.set === guess.set) &&
    //             correctCost === (champion.cost === guess.cost) &&
    //             correctGender === (champion.gender === guess.gender) &&
    //             correctRange === (champion.range === guess.range) &&
    //             (correctTraits === 1
    //                 ? champion.traits.some((trait) =>
    //                       guess.traits.includes(trait)
    //                   )
    //                 : correctTraits === 2
    //                 ? champion.traits.every((trait) =>
    //                       guess.traits.includes(trait)
    //                   )
    //                 : !champion.traits.some((trait) =>
    //                       guess.traits.includes(trait)
    //                   ));

    //         if (!isValid) map.delete(key);
    //     });

    //     graph.nodes = graph.nodes.filter(
    //         (champion) => (graph.edges.get(champion.id)?.size ?? 0) > 0
    //     );

    //     return graph;
    // };

    // const createGraph = (data: Champion[]) => {
    //     const graph: Graph = { nodes: data, edges: new Map() };
    //     data.forEach((champ) => graph.edges.set(champ.id, new Set()));

    //     for (let i = 0; i < data.length; i++) {
    //         for (let j = i + 1; j < data.length; j++) {
    //             const A = data[i];
    //             const B = data[j];

    //             if (
    //                 A.set === B.set ||
    //                 A.cost === B.cost ||
    //                 A.gender === B.gender ||
    //                 A.range === B.range ||
    //                 A.traits.some((trait) => B.traits.includes(trait))
    //             ) {
    //                 graph.edges.get(A.id)?.add(B.id);
    //                 graph.edges.get(B.id)?.add(A.id);
    //             }
    //         }
    //     }
    //     return graph;
    // };

    // const calculateNormalizedScore = (
    //     guess: Champion,
    //     remaining: Champion[],
    //     graph: Graph
    // ): number => {
    //     const eliminatedNodes = remaining.filter((champ) => {
    //         const filteredGraph = filterGraph(graph, guess);
    //         return !filteredGraph.nodes.includes(champ);
    //     }).length;

    //     console.log(eliminatedNodes);

    //     const maxEliminatedNodes = Math.max(
    //         ...remaining.map((champ) => {
    //             const filteredGraph = filterGraph(graph, champ);
    //             return remaining.length - filteredGraph.nodes.length;
    //         })
    //     );

    //     return maxEliminatedNodes > 0
    //         ? eliminatedNodes / maxEliminatedNodes
    //         : 0;
    // };

    // const calculateEntropy = (
    //     remaining: Champion[],
    //     possibleGuesses: Champion[]
    // ): number => {
    //     let totalEntropy = 0;
    //     const totalCount = remaining.length;

    //     for (const guess of possibleGuesses) {
    //         const partitions = new Map<string, number>();

    //         for (const target of remaining) {
    //             const key =
    //                 `${target.set === guess.set ? 1 : 0}` +
    //                 `${target.cost === guess.cost ? 1 : 0}` +
    //                 `${target.gender === guess.gender ? 1 : 0}` +
    //                 `${target.range === guess.range ? 1 : 0}` +
    //                 `${
    //                     target.traits.filter((trait) =>
    //                         guess.traits.includes(trait)
    //                     ).length
    //                 }`;

    //             partitions.set(key, (partitions.get(key) || 0) + 1);
    //         }

    //         let entropy = 0;
    //         for (const count of partitions.values()) {
    //             const probability = count / totalCount;
    //             entropy -= probability * Math.log2(probability);
    //         }

    //         totalEntropy += entropy;
    //     }

    //     return totalEntropy;
    // };

    // const calculateScore = (
    //     guess: Champion,
    //     remaining: Champion[],
    //     knownAttributes: Partial<Champion>
    // ): number => {
    //     let score = 0;

    //     if (knownAttributes.set) {
    //         score -=
    //             guess.set === knownAttributes.set ? 0 : attributeWeights.set;
    //     }
    //     if (knownAttributes.cost) {
    //         score -=
    //             guess.cost === knownAttributes.cost ? 0 : attributeWeights.cost;
    //     }
    //     if (knownAttributes.gender) {
    //         score -=
    //             guess.gender === knownAttributes.gender
    //                 ? 0
    //                 : attributeWeights.gender;
    //     }
    //     if (knownAttributes.range) {
    //         score -=
    //             guess.range === knownAttributes.range
    //                 ? 0
    //                 : attributeWeights.range;
    //     }

    //     if (knownAttributes.traits) {
    //         const matchedTraits = guess.traits.filter((trait) =>
    //             knownAttributes.traits!.includes(trait)
    //         ).length;
    //         score -=
    //             Math.abs(knownAttributes.traits!.length - matchedTraits) * 1; // Penalize mismatched traits
    //     }

    //     const initialEntropy = calculateEntropy(remaining, remaining);
    //     const newEntropy = calculateEntropy(
    //         remaining.filter((champ) => champ.id !== guess.id),
    //         remaining
    //     );

    //     score += initialEntropy - newEntropy;

    //     return score;
    // };

    // const bestGuessBasedOnKnownInfoAndEntropy = (
    //     remaining: Champion[],
    //     knownAttributes: Partial<Champion>
    // ): Champion => {
    //     let bestGuess: Champion | null = null;
    //     let bestScore = -Infinity;

    //     for (const guess of remaining) {
    //         const score = calculateScore(guess, remaining, knownAttributes);
    //         if (score > bestScore) {
    //             bestScore = score;
    //             bestGuess = guess;
    //         }
    //     }

    //     return bestGuess!;
    // };

    const getStats = () => {
        const stats = localStorage.getItem("tftdlestats");
        return stats
            ? {
                  ...JSON.parse(stats),
                  guessDistribution: JSON.parse(stats).guessDistribution || {},
                  lastPlayed: JSON.parse(stats).lastPlayed || null,
              }
            : {
                  gamesPlayed: 0,
                  oneShots: 0,
                  currentStreak: 0,
                  maxStreak: 0,
                  totalGuesses: 0,
                  lastPlayed: null,
                  guessDistribution: {},
              };
    };

    useEffect(() => {
        const updateStats = (guesses: number) => {
            const stats = getStats();
            if (finished) {
                if (guesses === 1) {
                    stats.oneShots += 1;
                }
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                const lastPlayed = stats.lastPlayed
                    ? new Date(stats.lastPlayed)
                    : null;
                if (lastPlayed?.toDateString() === yesterday.toDateString()) {
                    stats.currentStreak++;
                } else {
                    stats.currentStreak = 1;
                }
                stats.lastPlayed = today;
                stats.gamesPlayed++;
                stats.totalGuesses += guesses;
                stats.maxStreak = Math.max(
                    stats.maxStreak,
                    stats.currentStreak
                );

                if (!stats.guessDistribution[guesses]) {
                    stats.guessDistribution[guesses] = 0;
                }
                stats.guessDistribution[guesses] += 1;

                localStorage.setItem("tftdlestats", JSON.stringify(stats));
            }
            return stats;
        };

        if (finished) {
            const stats = updateStats(guesses.length);
            setStats(stats);
        }
    }, [finished, guesses.length]);

    useEffect(() => {
        if (champs) {
            setAnswer(champs[Math.floor(Math.random() * champs.length)]);
            setFilteredChamps(champs);
            // setGraph(createGraph(champs));
        }
    }, [champs]);

    useEffect(() => {
        if (champs) {
            // const filteredGraph = createGraph(
            //     champs.filter((champ) => {
            //         const g = filterGraph(graph, champs[guesses[0]]);
            //         return g.nodes.includes(champ);
            //     })
            // );
            // console.log(filteredGraph);
            // setGraph(filteredGraph);
            // const remainingChamps = champs.filter((champ) =>
            //     filteredGraph.nodes.includes(champ)
            // );
            // console.log(
            //     calculateNormalizedScore(
            //         champs[guesses[0]],
            //         remainingChamps,
            //         graph
            //     )
            // );
            // const possibleGuesses = champs.filter(
            //     (_, index) => !guesses.includes(index)
            // );
            // const entropy = calculateEntropy(remainingChamps, possibleGuesses);
            // console.log("Entropy:", entropy);
            // const bestGuess = bestGuessBasedOnKnownInfoAndEntropy(
            //     remainingChamps,
            //     {
            //         set: champs[guesses[guesses.length - 1]].set,
            //         cost: champs[guesses[guesses.length - 1]].cost,
            //         gender: champs[guesses[guesses.length - 1]].gender,
            //         range: champs[guesses[guesses.length - 1]].range,
            //         traits: champs[guesses[guesses.length - 1]].traits,
            //     }
            // );
            // console.log(
            //     calculateScore(champs[guesses[0]], remainingChamps, {
            //         set: champs[guesses[guesses.length - 1]].set,
            //         cost: champs[guesses[guesses.length - 1]].cost,
            //         gender: champs[guesses[guesses.length - 1]].gender,
            //         range: champs[guesses[guesses.length - 1]].range,
            //         traits: champs[guesses[guesses.length - 1]].traits,
            //     })
            // );
            // console.log("Best Guess:", bestGuess);
        }
    }, [guesses, champs]);

    return (
        <>
            <Head>
                <link rel="preload" href={"/logo.png"} as="image"></link>
                <link rel="preconnect" href={supabaseUrl} />
            </Head>
            {champs && filteredChamps && answer && (
                <div
                    className={`flex flex-col items-center ${
                        guesses.length === 0 ? "justify-center" : ""
                    } min-h-screen w-full text-black pb-10`}
                >
                    <div className="w-screen h-screen fixed -z-50">
                        <Image
                            src={"/background.png"}
                            height={4096}
                            width={5760}
                            priority
                            loading="eager"
                            alt="Background"
                        />
                    </div>

                    <div
                        className={`w-[500px] relative ${
                            guesses.length !== 0 ? "mt-32" : ""
                        }`}
                    >
                        <Image
                            src={"/logo.png"}
                            height={375}
                            width={1258}
                            alt="Logo"
                            priority
                            loading="eager"
                            quality={75}
                            sizes="(max-width: 768px) 80vw, 50vw"
                        />
                    </div>
                    {!finished && (
                        <div className="text-white font-[Beatrice-Extrabold] text-4xl mt-10 mb-10">
                            Guess today&apos;s TFT champion!
                        </div>
                    )}
                    {!finished && (
                        <div className="flex flex-row w-1/2 justify-center items-center relative mb-4">
                            <input
                                className={`w-96 px-5 pr-16 h-12 bg-slate-50 ${
                                    query === "" || filteredChamps.length === 0
                                        ? "rounded-3xl"
                                        : "rounded-t-3xl"
                                } focus:outline-none font-[Beatrice-Medium] text-[#868686]`}
                                type="text"
                                name="search"
                                id="search"
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
                                                        .replace("'", "")
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
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        setQuery("");
                                        setGuesses([
                                            champs.indexOf(filteredChamps[0]),
                                            ...guesses,
                                        ]);
                                        setFinished(
                                            filteredChamps[0] === answer
                                        );
                                    }
                                }}
                            />

                            {query.length > 0 && filteredChamps.length > 0 ? (
                                <div className="absolute top-12 max-h-60 w-96 rounded-b-xl overflow-y-auto custom-scrollbar">
                                    <div
                                        className={`bg-slate-50 py-0 ${
                                            filteredChamps.length > 0
                                                ? ""
                                                : "hidden"
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
                                                            champs.indexOf(
                                                                champ
                                                            ),
                                                            ...guesses,
                                                        ]);
                                                        setFinished(
                                                            champ === answer
                                                        );
                                                    }}
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key == "Enter") {
                                                            setQuery("");
                                                            setGuesses([
                                                                champs.indexOf(
                                                                    champ
                                                                ),
                                                                ...guesses,
                                                            ]);
                                                            setFinished(
                                                                champ === answer
                                                            );
                                                        }
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
                                                    <span className="font-[Beatrice-Medium]">
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
                    )}
                    {resultsClosed && finished && (
                        <div className="relative text-white" id="results">
                            <Image
                                src={"/win.png"}
                                alt="Kobuko"
                                width={440}
                                height={319}
                                style={{ position: "absolute", zIndex: -1 }}
                            />
                            <div className="flex flex-col h-[614px] w-[440px] items-center rounded-2xl relative">
                                <span className="text-5xl font-[Beatrice-Extrabold] mt-6">
                                    VICTORY
                                </span>
                                <span className="mt-60 mb-2">You guessed</span>
                                <span className="text-3xl font-[Beatrice-Extrabold]">
                                    {answer.name}
                                </span>
                                <span className="font-[Beatrice-MediumItalic]">
                                    {"SET " + answer.set}
                                </span>
                                <span className="text-sm mt-4 mb-4">
                                    {"Number of tries: "}
                                    <span className="text-[#FFB131]">
                                        {guesses.length}
                                    </span>
                                </span>
                                <button
                                    className="text-[#31217D] rounded-lg bg-white px-2 py-1 mt-2 mb-6 w-20 text-sm font-[Beatrice-Extrabold] cursor-pointer flex flex-row gap-x-1 items-center"
                                    onClick={() => setShowStats(true)}
                                >
                                    <IoIosStats className="text-base" />
                                    <span className="mt-0.5">STATS</span>
                                </button>
                                <span className="text-sm mt-2">
                                    Next champion in
                                </span>
                                <span className="font-[Beatrice-Extrabold] text-2xl">
                                    {timeLeft.hours
                                        .toString()
                                        .padStart(2, "0") +
                                        ":" +
                                        timeLeft.minutes
                                            .toString()
                                            .padStart(2, "0") +
                                        ":" +
                                        timeLeft.seconds
                                            .toString()
                                            .padStart(2, "0")}
                                </span>
                                <span className="text-xs text-[#868686] font-[Beatrice-MediumItalic]">
                                    Timezone: Pacific Standard Time (UTC-8)
                                </span>
                            </div>
                        </div>
                    )}
                    <div>
                        <div
                            className={`grid grid-cols-6 gap-2 p-4 text-white text-center text-sm font-[Beatrice-Extrabold] ${
                                guesses.length === 0 ? "hidden" : ""
                            }`}
                        >
                            <span>NAME</span>
                            <span>SET</span>
                            <span>COST</span>
                            <span>GENDER</span>
                            <span>RANGE</span>
                            <span>TRAITS</span>
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
                                            alt="Champion Icon"
                                            placeholder="blur"
                                            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0VKztAQACtwFdoQskOAAAAABJRU5ErkJggg=="
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <Tile
                                        guess={set}
                                        correctValue={answer.set}
                                    />
                                    <Tile
                                        guess={cost}
                                        correctValue={answer.cost}
                                    />
                                    <Tile
                                        guess={
                                            {
                                                0: "Male",
                                                1: "Female",
                                                2: "Other",
                                            }[gender] || "Unknown"
                                        }
                                        correctValue={
                                            {
                                                0: "Male",
                                                1: "Female",
                                                2: "Other",
                                            }[answer.gender] || "Unknown"
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

                    {showIndicators && (
                        <div
                            className={`flex flex-col items-center justify-center gap-2 mt-16 mb-8 p-4 bg-[#31217D]/55 rounded-2xl text-white font-[Beatrice-Extrabold] relative ${
                                guesses.length === 0 ? "hidden" : ""
                            }`}
                        >
                            <IoClose
                                className="absolute top-5 right-5 text-white cursor-pointer"
                                onClick={() => {
                                    setShowIndicators(false);
                                }}
                            />
                            {"INDICATORS"}
                            <div className="grid grid-cols-5 gap-2 mb-3 text-white">
                                <Tile
                                    guess={"Correct"}
                                    correctValue={"Correct"}
                                />
                                <Tile
                                    guess={["Partial"]}
                                    correctValue={["Partial", ""]}
                                />
                                <Tile guess={"Wrong"} correctValue={""} />
                                <Tile guess={"Higher"} correctValue={""} />
                                <Tile guess={"Lower"} correctValue={""} />
                            </div>
                        </div>
                    )}

                    {finished && !resultsClosed && (
                        <div className="top-0 left-0 w-screen h-screen bg-black/50 flex flex-col items-center justify-center text-center backdrop-blur-md fixed text-white font-[Beatrice-Medium]">
                            <Image
                                src={"/win.png"}
                                alt="Kobuko"
                                width={440}
                                height={319}
                                style={{ position: "absolute", zIndex: -1 }}
                            />
                            <div className="flex flex-col h-[614px] w-[440px] items-center rounded-2xl relative">
                                <IoClose
                                    className="absolute top-5 right-5 text-white cursor-pointer"
                                    onClick={() => {
                                        setResultsClosed(true);
                                    }}
                                />
                                <span className="text-5xl font-[Beatrice-Extrabold] mt-4">
                                    VICTORY
                                </span>
                                <span className="mt-62 mb-2">You guessed</span>
                                <span className="text-3xl font-[Beatrice-Extrabold]">
                                    {answer.name}
                                </span>
                                <span className="font-[Beatrice-MediumItalic]">
                                    {"SET " + answer.set}
                                </span>
                                <span className="text-sm mt-4 mb-4">
                                    {"Number of tries: "}
                                    <span className="text-[#FFB131]">
                                        {guesses.length}
                                    </span>
                                </span>
                                <button
                                    className="text-[#31217D] rounded-lg bg-white px-2 py-1 mt-2 mb-6 w-20 text-sm font-[Beatrice-Extrabold] cursor-pointer flex flex-row gap-x-1 items-center"
                                    onClick={() => {
                                        setShowStats(true);
                                        document
                                            .getElementById("results")
                                            ?.scrollIntoView();
                                        setResultsClosed(true);
                                    }}
                                >
                                    <IoIosStats className="text-base" />
                                    <span className="mt-0.5">STATS</span>
                                </button>
                                <span className="text-sm mt-2">
                                    Next champion in
                                </span>
                                <span className="font-[Beatrice-Extrabold] text-2xl">
                                    {timeLeft.hours
                                        .toString()
                                        .padStart(2, "0") +
                                        ":" +
                                        timeLeft.minutes
                                            .toString()
                                            .padStart(2, "0") +
                                        ":" +
                                        timeLeft.seconds
                                            .toString()
                                            .padStart(2, "0")}
                                </span>
                                <span className="text-xs text-[#868686] font-[Beatrice-MediumItalic]">
                                    Timezone: Pacific Standard Time (UTC-8)
                                </span>
                            </div>
                        </div>
                    )}
                    {showStats && (
                        <div className="top-0 left-0 w-screen h-screen bg-black/50 flex flex-col items-center justify-center text-center backdrop-blur-md fixed text-white font-[Beatrice-ExtraBold]">
                            <div className="flex flex-col h-[500px] w-[800px] rounded-2xl relative bg-[#31217D] p-12">
                                <IoClose
                                    className="absolute top-5 right-5 text-white cursor-pointer"
                                    onClick={() => {
                                        setShowStats(false);
                                    }}
                                />
                                <div className="flex flex-col w-2/5">
                                    <span className="text-5xl font-[Beatrice-Extrabold]">
                                        STATISTICS
                                    </span>
                                    <div className="flex flex-row justify-between mt-8 text-lg">
                                        <span>WON</span>
                                        <span>{stats?.gamesPlayed}</span>
                                    </div>
                                    <div className="flex flex-row justify-between mt-4 text-lg">
                                        <span>ONE SHOTS</span>
                                        <span>{stats?.oneShots}</span>
                                    </div>
                                    <div className="flex flex-row justify-between mt-4 text-lg">
                                        <span>AVG GUESSES</span>
                                        <span>
                                            {stats?.gamesPlayed &&
                                            stats?.totalGuesses
                                                ? (
                                                      stats.totalGuesses /
                                                      stats.gamesPlayed
                                                  ).toFixed(2)
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between mt-4 text-lg">
                                        <span>CURRENT STREAK</span>
                                        <span>{stats?.currentStreak}</span>
                                    </div>
                                    <div className="flex flex-row justify-between mt-4 text-lg">
                                        <span>MAX STREAK</span>
                                        <span>{stats?.maxStreak}</span>
                                    </div>
                                    <div className="w-full h-[2px] bg-white mt-8 mb-8"></div>
                                    <div className="text-5xl text-[#BDD783] self-start">
                                        90%
                                    </div>
                                </div>
                                <div className="flex flex-col w-3/5"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
