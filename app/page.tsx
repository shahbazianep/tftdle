"use client";
import Image from "next/image";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
import { Champion, Stats } from "@/assets/types/types";
import Tile from "@/components/Tile";
import Switch from "@/components/Switch";
import Head from "next/head";
import {
    IoIosInformationCircle,
    IoIosStats,
    IoMdArrowForward,
} from "react-icons/io";
import { IoClose, IoStatsChart } from "react-icons/io5";
import { guessResults } from "@/assets/data";

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
    const [simulatedGuesses, setSimulatedGuesses] = useState<number>(-1);
    const [flawless, setFlawless] = useState<boolean>(true);
    const [correctCategories, setCorrectCategories] = useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
    ]);
    // const [hintsUsed, setHintsUsed] = useState<number>(0);
    const [hintsEnabled, setHintsEnabled] = useState<boolean>(false);
    const [showAnalysisExplanation, setShowAnalysisExplanation] =
        useState<boolean>(false);

    const correctCategoriesRef = useRef(correctCategories);

    function getTimeUntilMidnight() {
        const now = new Date();
        const pacificNow = new Date(
            now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
        );
        const pacificMidnight = new Date(pacificNow);
        pacificMidnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight =
            pacificMidnight.getTime() - pacificNow.getTime();

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
        setStats(getStats());

        return () => clearInterval(timer);
    }, []);

    // const filterGraph = (graph: Graph, guess: Champion, answer: Champion) => {
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

    //     // Create a deep copy of the graph
    //     const newGraph: Graph = {
    //         nodes: [...graph.nodes],
    //         edges: new Map(
    //             Array.from(graph.edges.entries()).map(([key, value]) => [
    //                 key,
    //                 new Set(value),
    //             ])
    //         ),
    //     };

    //     newGraph.edges.forEach((value, key, map) => {
    //         const champion = newGraph.nodes.find((champ) => champ.id === key);
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

    //     // Remove the current guess from the graph
    //     newGraph.nodes = newGraph.nodes.filter(
    //         (champion) =>
    //             champion.id !== guess.id &&
    //             (newGraph.edges.get(champion.id)?.size ?? 0) > 0
    //     );
    //     newGraph.edges.delete(guess.id);

    //     return newGraph;
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
    //         const filteredGraph = filterGraph(graph, gues);
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

    // const bestGuessBasedOnKnownInfoAndEntropy = (
    //     remaining: Champion[],
    //     knownAttributes: Partial<Champion>
    // ): Champion => {
    //     let bestGuess: Champion | null = null;
    //     let bestScore = -Infinity;

    //     const initialEntropy = calculateEntropy(remaining, remaining);

    //     for (const guess of remaining) {
    //         const filteredRemaining = remaining.filter(
    //             (champ) => champ.id !== guess.id
    //         );
    //         const newEntropy = calculateEntropy(filteredRemaining, remaining);

    //         let score = initialEntropy - newEntropy;

    //         if (knownAttributes.set) {
    //             score -=
    //                 guess.set === knownAttributes.set
    //                     ? 0
    //                     : attributeWeights.set;
    //         }
    //         if (knownAttributes.cost) {
    //             score -=
    //                 guess.cost === knownAttributes.cost
    //                     ? 0
    //                     : attributeWeights.cost;
    //         }
    //         if (knownAttributes.gender) {
    //             score -=
    //                 guess.gender === knownAttributes.gender
    //                     ? 0
    //                     : attributeWeights.gender;
    //         }
    //         if (knownAttributes.range) {
    //             score -=
    //                 guess.range === knownAttributes.range
    //                     ? 0
    //                     : attributeWeights.range;
    //         }
    //         if (knownAttributes.traits) {
    //             const matchedTraits = guess.traits.filter((trait) =>
    //                 knownAttributes.traits!.includes(trait)
    //             ).length;
    //             score -= Math.abs(
    //                 knownAttributes.traits!.length - matchedTraits
    //             );
    //         }

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
                  currentStreak: 0,
                  maxStreak: 0,
                  totalGuesses: 0,
                  lastPlayed: null,
                  guessDistribution: {},
                  score: 0,
                  cumulativeScore: 0,
                  flawless: 0,
                  hintsUsed: 0,
              };
    };

    useEffect(() => {
        const updateStats = (guesses: number) => {
            const stats = getStats();
            if (finished) {
                const today = new Date();
                const lastPlayed = new Date(stats.lastPlayed);

                if (lastPlayed.toDateString() === today.toDateString()) {
                    return stats;
                }

                if (flawless) {
                    stats.flawless += 1;
                }

                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                if (lastPlayed.toDateString() === yesterday.toDateString()) {
                    stats.currentStreak++;
                } else {
                    stats.currentStreak = 1;
                }

                stats.lastPlayed = today;
                stats.score =
                    guesses <= simulatedGuesses
                        ? 100
                        : guesses > simulatedGuesses * 5
                        ? 0
                        : 100 -
                          100 *
                              (1 / (1 + Math.E) ** (-0.216 * (guesses - 22.6)));

                stats.cumulativeScore =
                    (stats.cumulativeScore * stats.gamesPlayed + stats.score) /
                    (stats.gamesPlayed + 1);
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
    }, [finished, guesses.length, simulatedGuesses, flawless]);

    useEffect(() => {
        if (champs) {
            const dateSeed = new Date()
                .toLocaleString("en-CA", { timeZone: "America/Los_Angeles" })
                .slice(0, 10);
            let hash = 0;
            for (let i = 0; i < dateSeed.length; i++) {
                hash = (hash * 31 + dateSeed.charCodeAt(i)) % 1237;
            }
            setAnswer(champs[hash]);
            setSimulatedGuesses(guessResults[hash]);
            setFilteredChamps(champs);
            // setGraph(createGraph(champs));
            // console.log(createGraph(champs));
        }
    }, [champs]);

    useEffect(() => {
        correctCategoriesRef.current = correctCategories;
    }, [correctCategories]);

    useEffect(() => {
        if (flawless && champs && answer && guesses.length > 0) {
            const currentGuess = champs[guesses[0]];
            const x = correctCategoriesRef.current;
            if (currentGuess.set != answer.set && x[0]) {
                setFlawless(false);
            } else if (currentGuess.cost != answer.cost && x[1]) {
                setFlawless(false);
            } else if (currentGuess.gender != answer.gender && x[2]) {
                setFlawless(false);
            } else if (currentGuess.range != answer.range && x[3]) {
                setFlawless(false);
            } else if (currentGuess.traits != answer.traits && x[4]) {
                setFlawless(false);
            } else {
                const updatedCategories = [
                    x[0] || currentGuess.set == answer.set,
                    x[1] || currentGuess.cost == answer.cost,
                    x[2] || currentGuess.gender == answer.gender,
                    x[3] || currentGuess.range == answer.range,
                    x[4] ||
                        currentGuess.traits.every((trait) =>
                            answer.traits.includes(trait)
                        ),
                ];
                setCorrectCategories(updatedCategories);
                correctCategoriesRef.current = updatedCategories;
            }
        }
    }, [guesses, champs, answer, flawless]);

    // useEffect(() => {
    //     if (champs && graph && answer) {
    //         let results = [];
    //         for (let i = 500; i < 1236; i++) {
    //             console.log(i);
    //             let simGuess = [...guesses];
    //             let answer = champs[i];
    //             let filteredGraph = createGraph(champs);
    //             while (true) {
    //                 const currentGuess = champs[simGuess[0]];
    //                 if (simGuess.length > 15) {
    //                     console.log(answer, filteredGraph, currentGuess);
    //                     break;
    //                 }
    //                 if (currentGuess.id === answer!.id) break;
    //                 filteredGraph = filterGraph(
    //                     filteredGraph,
    //                     currentGuess,
    //                     answer
    //                 );
    //                 // console.log(filteredGraph);
    //                 // setGraph(filteredGraph);
    //                 const remainingChamps = champs.filter((champ) =>
    //                     filteredGraph.nodes.includes(champ)
    //                 );
    //                 // console.log(remainingChamps);
    //                 const possibleGuesses = champs.filter(
    //                     (_, index) => !guesses.includes(index)
    //                 );
    //                 const entropy = calculateEntropy(
    //                     remainingChamps,
    //                     possibleGuesses
    //                 );
    //                 // console.log("Entropy:", entropy);
    //                 const bestGuess = bestGuessBasedOnKnownInfoAndEntropy(
    //                     remainingChamps,
    //                     {
    //                         set: currentGuess.set,
    //                         cost: currentGuess.cost,
    //                         gender: currentGuess.gender,
    //                         range: currentGuess.range,
    //                         traits: currentGuess.traits,
    //                     }
    //                 );
    //                 // console.log("Best Guess:", bestGuess);
    //                 simGuess = [champs.indexOf(bestGuess), ...simGuess];
    //             }
    //             results.push(simGuess.length);
    //         }
    //         console.log(results);
    //     }
    // }, [guesses, champs]);

    return (
        <div className="flex flex-grow min-h-screen flex-col">
            <Head>
                <link rel="preload" href={"/logo.png"} as="image"></link>
                <link rel="preconnect" href={supabaseUrl} />
            </Head>
            {champs && filteredChamps && answer && (
                <div
                    className={`flex flex-col items-center ${
                        guesses.length === 0 ? "justify-center" : ""
                    } flex-grow w-full text-black pb-10`}
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
                        <div className="flex flex-row justify-center items-center relative mb-4">
                            <div
                                className="rounded-full w-9 h-9 bg-[#4C6FFA] absolute z-10 right-1.5 cursor-pointer flex items-center justify-center"
                                onClick={() => {
                                    if (
                                        filteredChamps.length > 0 &&
                                        query.length > 0
                                    ) {
                                        setQuery("");
                                        setGuesses([
                                            champs.indexOf(filteredChamps[0]),
                                            ...guesses,
                                        ]);
                                        setFinished(
                                            filteredChamps[0] === answer
                                        );
                                        document
                                            .getElementById("search")
                                            ?.focus();
                                    }
                                }}
                            >
                                <IoMdArrowForward className="text-white w-6 h-6" />
                            </div>
                            <input
                                className={`w-96 px-5 pr-16 h-12 bg-slate-50 ${
                                    query === "" || filteredChamps.length === 0
                                        ? "rounded-3xl"
                                        : "rounded-t-3xl"
                                } focus:outline-none font-[Beatrice-Medium] text-[#868686]`}
                                type="text"
                                placeholder="Type a champion's name..."
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
                                                        .startsWith(
                                                            newQuery.toLowerCase()
                                                        ) &&
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
                                    if (
                                        e.key == "Enter" &&
                                        filteredChamps.length > 0
                                    ) {
                                        setQuery("");
                                        setGuesses([
                                            champs.indexOf(filteredChamps[0]),
                                            ...guesses,
                                        ]);
                                        setFinished(
                                            filteredChamps[0] === answer
                                        );
                                        document
                                            .getElementById("search")
                                            ?.focus();
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
                                                    className="shrink-0 flex h-8 px-5 py-6 bg-slate-50 items-center focus:outline-none focus:bg-[#bdbacc] hover:bg-[#bdbacc] relative cursor-pointer z-50"
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
                                                        document
                                                            .getElementById(
                                                                "search"
                                                            )
                                                            ?.focus();
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
                                                            document
                                                                .getElementById(
                                                                    "search"
                                                                )
                                                                ?.focus();
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
                        <div
                            className="relative text-white mt-12 mb-12"
                            id="results"
                        >
                            <Image
                                src={"/win.png"}
                                alt="Kobuko"
                                width={440}
                                height={319}
                                style={{ position: "absolute", zIndex: -1 }}
                            />
                            <div className="flex flex-col h-[614px] w-[440px] items-center rounded-2xl relative p-2 font-[Beatrice-Medium]">
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
                                <span className="text-sm mt-4 mb-2">
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
                                <span className="text-sm">
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
                                        field="set"
                                        hintsEnabled={hintsEnabled}
                                    />
                                    <Tile
                                        guess={cost}
                                        correctValue={answer.cost}
                                        field="cost"
                                        hintsEnabled={hintsEnabled}
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
                                        field="gender"
                                        hintsEnabled={hintsEnabled}
                                    />
                                    <Tile
                                        guess={range}
                                        correctValue={answer.range}
                                        field="range"
                                        hintsEnabled={hintsEnabled}
                                    />
                                    <Tile
                                        guess={traits}
                                        correctValue={answer.traits}
                                        field="traits"
                                        hintsEnabled={hintsEnabled}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <Switch checked={hintsEnabled} onChange={setHintsEnabled} />
                    {showIndicators && (
                        <div
                            className={`flex flex-col items-center justify-center gap-2 mt-12 mb-8 p-4 bg-[#31217D]/55 rounded-2xl text-white font-[Beatrice-Extrabold] relative ${
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
                                <Tile
                                    guess={"Higher"}
                                    correctValue={"Z"}
                                    field="set"
                                    hintsEnabled
                                />
                                <Tile
                                    guess={"Lower"}
                                    correctValue={""}
                                    field="set"
                                    hintsEnabled
                                />
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
                            <div className="flex flex-col h-[614px] w-[440px] items-center rounded-2xl relative p-2">
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
                                <span className="text-sm mt-4 mb-2">
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
                                <span className="text-sm">
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
                        <div className="top-0 left-0 w-screen h-screen bg-black/50 flex flex-col items-center justify-center text-center backdrop-blur-md fixed text-white font-[Beatrice-ExtraBold] z-50">
                            <div className="flex flex-col h-[500px] w-[800px] rounded-2xl relative bg-[#31217D] p-12">
                                <IoClose
                                    className="absolute top-5 right-5 text-white cursor-pointer"
                                    onClick={() => {
                                        setShowStats(false);
                                    }}
                                />
                                <div className="flex flex-col w-full items-center justify-between h-full">
                                    <div className="flex flex-row items-center justify-center w-full gap-x-4">
                                        <IoStatsChart size={32} />
                                        <span className="text-5xl font-[Beatrice-Extrabold]">
                                            STATISTICS
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between w-4/5">
                                        <div className="flex flex-col text-4xl gap-y-1">
                                            <span>{stats?.gamesPlayed}</span>
                                            <span className="text-wrap text-[#52429D] text-lg leading-none">
                                                WON
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-4xl gap-y-1">
                                            <span>{stats?.flawless}</span>
                                            <span className="text-wrap text-[#52429D] text-lg leading-none">
                                                FLAWLESS
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-4xl gap-y-1">
                                            <span>
                                                {stats?.gamesPlayed &&
                                                stats?.totalGuesses
                                                    ? (
                                                          stats.totalGuesses /
                                                          stats.gamesPlayed
                                                      ).toFixed(1)
                                                    : "N/A"}
                                            </span>
                                            <span className="text-wrap text-[#52429D] text-lg leading-none">
                                                AVG
                                                <br />
                                                GUESSES
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-4xl gap-y-1">
                                            <span>{stats?.currentStreak}</span>
                                            <span className="text-wrap text-[#52429D] text-lg leading-none">
                                                CURRENT
                                                <br />
                                                STREAK
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-4xl gap-y-1">
                                            <span>{stats?.maxStreak}</span>
                                            <span className="text-wrap text-[#52429D] text-lg leading-none">
                                                MAX
                                                <br />
                                                STREAK
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-center w-full gap-x-4">
                                        <div className="flex flex-col gap-y-4 w-full">
                                            <div className="w-full flex flex-row items-center">
                                                <div
                                                    className="rounded-br-full rounded-tr-full h-16 bg-[#A3C751] mr-4 flex items-center justify-end p-4 text-2xl"
                                                    style={{
                                                        width:
                                                            (
                                                                Math.max(
                                                                    stats!
                                                                        .score,
                                                                    30
                                                                ) * 4
                                                            ).toFixed(0) + "px",
                                                    }}
                                                >
                                                    {stats!.score.toFixed(0)}%
                                                </div>
                                                <div className="text-[#85F2A7] text-lg">
                                                    TODAY
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-row items-center">
                                                <div
                                                    className="rounded-br-full rounded-tr-full h-16 bg-[#4C6FFA] mr-4 flex items-center justify-end p-4 text-2xl"
                                                    style={{
                                                        width:
                                                            (
                                                                Math.max(
                                                                    stats!
                                                                        .score,
                                                                    30
                                                                ) * 4
                                                            ).toFixed(0) + "px",
                                                    }}
                                                >
                                                    {stats!.cumulativeScore.toFixed(
                                                        0
                                                    )}
                                                    %
                                                </div>
                                                <div className="text-[#85F2A7] text-lg">
                                                    CUMULATIVE
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-2xl text-left h-full flex flex-col justify-center relative">
                                            <span>
                                                TFTDLE
                                                <span className="text-[#85F2A7]">
                                                    BOT
                                                </span>
                                            </span>
                                            ANALYSIS SCORE
                                            <span
                                                className="absolute bottom-1 text-[#868686] text-xs flex flex-row items-center gap-x-1 font-[Beatrice-MediumItalic] cursor-help"
                                                onMouseEnter={() => {
                                                    setShowAnalysisExplanation(
                                                        true
                                                    );
                                                }}
                                                onMouseLeave={() => {
                                                    setShowAnalysisExplanation(
                                                        false
                                                    );
                                                }}
                                            >
                                                <IoIosInformationCircle />
                                                <span className="mt-[1px]">
                                                    What&apos;s this?
                                                </span>
                                            </span>
                                            {showAnalysisExplanation && (
                                                <div className="top-full bg-white rounded-2xl w-72 absolute flex flex-col items-center text-[#2B2061] text-xs p-4">
                                                    <span>
                                                        TFTDLEBOT ANALYSIS SCORE
                                                    </span>
                                                    <span className="font-[Beatrice-Medium] mt-2">
                                                        The TFTdleBot analysis
                                                        score is a measure of
                                                        your performance
                                                        compared to the optimal
                                                        solution found by
                                                        TFTdleBot. Scores are
                                                        calculated in a
                                                        nonlinear fashion
                                                        ranging from 100 (you
                                                        beat the bot) to 0. The
                                                        cumulative score
                                                        measures your
                                                        performance over time.
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="mt-auto flex flex-col items-center pb-4">
                <div className="text-white font-[Beatrice-Medium] text-sm mb-2">
                    tftdle | 2025
                </div>
                <div className="text-[#868686] font-[Beatrice-Medium] text-xs">
                    tftdle was created using assets owned by Riot Games, and is
                    not endorsed or sponsored by Riot Games or its affiliates
                </div>
            </div>
        </div>
    );
}
