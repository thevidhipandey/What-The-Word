import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { WORDLISTS, WORD_MEANINGS } from "@/lib/word-data";

type WordLength = keyof typeof WORDLISTS;
type Difficulty = "easy" | "medium" | "tough";
type TileState = "correct" | "present" | "absent";
type Guess = { word: string; result: TileState[] };
type OwlMood = "watching" | "smug" | "offended";

const KEY_ROWS = ["qwertyuiop".split(""), "asdfghjkl".split(""), ["enter", ..."zxcvbnm".split(""), "back"]];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WhatTheWord — A little word game with attitude" },
      { name: "description", content: "Guess the word before the owl judges you. Pick your letter count and difficulty in this quirky little word game." },
      { property: "og:title", content: "WhatTheWord — A little word game with attitude" },
      { property: "og:description", content: "Guess the word before the owl judges you. Pick your letter count and difficulty in this quirky little word game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;600;700;800&display=swap" },
    ],
  }),
  component: WhatTheWord,
});

function scoreGuess(guess: string, answer: string, length: number): TileState[] {
  const result: TileState[] = Array(length).fill("absent");
  const answerLetters = answer.split("");
  const guessLetters = guess.split("");
  const used = Array(length).fill(false);

  for (let i = 0; i < length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }
  for (let i = 0; i < length; i++) {
    if (result[i] === "correct") continue;
    const match = answerLetters.findIndex((letter, index) => letter === guessLetters[i] && !used[index]);
    if (match !== -1) {
      result[i] = "present";
      used[match] = true;
    }
  }
  return result;
}

function getWordList(length: WordLength, difficulty: Difficulty) {
  const list = [...new Set(WORDLISTS[length][difficulty].map((word) => word.trim().toLowerCase()))]
    .filter((word) => word.length === length);
  return list.length ? list : WORDLISTS[5].medium;
}

function WhatTheWord() {
  const [length, setLength] = useState<WordLength>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [answer, setAnswer] = useState<string>(() => {
    const list = getWordList(5, "medium");
    return list[Math.floor(Math.random() * list.length)] ?? "bloom";
  });
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [owlMood, setOwlMood] = useState<OwlMood>("watching");
  const [celebrate, setCelebrate] = useState(false);
  const [owlComment, setOwlComment] = useState("Go on, then.");

  const keyboardStates = useMemo(() => {
    const states: Record<string, TileState> = {};
    const rank: Record<TileState, number> = { absent: 0, present: 1, correct: 2 };
    guesses.forEach(({ word, result }) => {
      [...word].forEach((letter, index) => {
        const next = result[index];
        if (letter && next && (!states[letter] || rank[next] > rank[states[letter]])) states[letter] = next;
      });
    });
    return states;
  }, [guesses]);

  const newGame = useCallback((nextLength = length, nextDifficulty = difficulty) => {
    const wordList = getWordList(nextLength, nextDifficulty);
    setLength(nextLength);
    setDifficulty(nextDifficulty);
    setAnswer(wordList[Math.floor(Math.random() * wordList.length)] ?? (nextLength === 4 ? "love" : nextLength === 6 ? "garden" : "bloom"));
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setGameOver(false);
    setOwlMood("watching");
    setCelebrate(false);
    setOwlComment("Go on, then.");
  }, [difficulty, length]);

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;
    if (key === "enter") {
      if (currentGuess.length !== length) {
        setMessage("Not enough letters");
        return;
      }
      const result = scoreGuess(currentGuess, answer, length);
      const nextGuesses = [...guesses, { word: currentGuess, result }];
      setGuesses(nextGuesses);
      setCurrentGuess("");
      setMessage("");
      if (currentGuess === answer) {
        setGameOver(true);
        setOwlMood("smug");
        setCelebrate(true);
        setOwlComment("Obviously.");
        setMessage(`Nicely done! Solved in ${nextGuesses.length}/6`);
      } else if (nextGuesses.length === 6) {
        setGameOver(true);
        setOwlMood("offended");
        setOwlComment("Unbelievable!");
        setMessage("The owl had this one.");
      } else {
        setOwlMood("watching");
        const closeLetters = result.filter((tile) => tile !== "absent").length;
        const farOffComments = ["Not even close!", "The word is hiding from you.", "A bold detour!", "Did you ask a pigeon?"];
        setOwlComment(closeLetters <= 1 ? farOffComments[(nextGuesses.length - 1) % farOffComments.length] : "Ooh, getting warmer...");
      }
      return;
    }
    if (key === "back") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setMessage("");
      return;
    }
    if (/^[a-z]$/.test(key)) {
      setCurrentGuess((guess) => guess.length < length ? guess + key : guess);
      setMessage("");
    }
  }, [answer, currentGuess, gameOver, guesses, length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.target instanceof HTMLSelectElement) return;
      const key = event.key.toLowerCase();
      if (key === "enter") handleKey("enter");
      else if (key === "backspace") handleKey("back");
      else if (/^[a-z]$/.test(key)) handleKey(key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  return (
    <main className={`game-shell ${celebrate ? "game-shell--celebrate" : ""}`}>
      {celebrate && <div className="confetti" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} />)}</div>}
      <header className="masthead">
        <div className="title-lockup">
          <div className="eyebrow"><span className="eyebrow-dot" /> THE DAILY GUESSING GAME <span className="eyebrow-dot" /></div>
          <h1>WhatThe<span>Word</span><b aria-hidden="true">?</b></h1>
          <p className="tagline">Words you know. An owl who knows better.</p>
        </div>
        <div className={`owl-sticker owl-sticker--${owlMood}`} aria-live="polite" aria-label={owlMood === "smug" ? "Owl looks smug: you won" : owlMood === "offended" ? "Owl looks dramatically offended: game over" : "Owl is watching your guesses"}>
          <div className="owl-speech">{owlComment}</div>
          <svg className="owl-art" viewBox="0 0 140 154" role="img" aria-label="A judgmental little owl">
            <path className="owl-ear" d="M30 48 20 12l34 21M110 48l10-36-34 21" />
            <path className="owl-body" d="M23 54Q18 30 50 39Q70 23 90 39Q122 30 117 59L119 105Q112 137 70 139Q28 137 21 105Z" />
            <path className="owl-wing" d="M25 76Q9 87 20 116Q27 128 40 120L47 91M115 76Q131 87 120 116Q113 128 100 120L93 91" />
            <ellipse className="owl-face" cx="51" cy="70" rx="24" ry="26" />
            <ellipse className="owl-face" cx="89" cy="70" rx="24" ry="26" />
            <ellipse className="owl-eye" cx="57" cy="72" rx="5" ry="8" />
            <ellipse className="owl-eye" cx="83" cy="72" rx="5" ry="8" />
            <path className="owl-brow" d={owlMood === "offended" ? "m38 55 25 8m14-1 25-8" : owlMood === "smug" ? "m38 64 25-6m14 0 25 6" : "m39 59 22 4m18 0 22-4"} />
            <path className="owl-beak" d="m63 91 7-10 7 10-7 9Z" />
            <path className="owl-belly" d="M42 105Q70 91 98 105Q96 134 70 135Q44 134 42 105Z" />
            <path className="owl-feet" d="m57 137-5 9m5-9 5 9m21-9-5 9m5-9 5 9" />
          </svg>
          <span className="owl-caption">your tiny critic</span>
        </div>
      </header>

      <section className="game-controls" aria-label="Game settings">
        <label className="setting"><span>Letters</span><select aria-label="Letters" value={length} onChange={(event) => newGame(Number(event.target.value) as WordLength, difficulty)}><option value={4}>4 letters</option><option value={5}>5 letters</option><option value={6}>6 letters</option></select></label>
        <span className="setting-divider" aria-hidden="true">✳</span>
        <label className="setting"><span>Difficulty</span><select aria-label="Difficulty" value={difficulty} onChange={(event) => newGame(length, event.target.value as Difficulty)}><option value="easy">Easy does it</option><option value="medium">Medium</option><option value="tough">Tough stuff</option></select></label>
      </section>

      <section className={`play-area length-${length}`} aria-label="Word guessing game">
        <div className="board" role="grid" aria-label={`${length} letter word, ${6 - guesses.length} guesses remaining`}>
          {Array.from({ length: 6 }, (_, rowIndex) => {
            const guess = guesses[rowIndex];
            const letters = guess?.word ?? (rowIndex === guesses.length && !gameOver ? currentGuess : "");
            return <div className="guess-row" role="row" key={rowIndex}>
              {Array.from({ length }, (_, columnIndex) => {
                const tileState = guess?.result[columnIndex];
                return <div className={`tile ${tileState ? `tile--${tileState} tile--flip` : ""} ${!guess && letters[columnIndex] ? "tile--filled" : ""}`} role="gridcell" aria-label={letters[columnIndex] ? `${letters[columnIndex]}${tileState ? `, ${tileState}` : ""}` : "empty"} key={columnIndex} style={tileState ? { animationDelay: `${columnIndex * 75}ms` } : undefined}>{letters[columnIndex] ?? ""}</div>;
              })}
            </div>;
          })}
        </div>
      </section>

      <p className={`game-message ${message.includes("Nicely done") ? "game-message--win" : ""}`} aria-live="polite">{message || " "}</p>
      {gameOver && <div className="word-reveal" aria-live="polite"><span className="word-reveal-label">THE WORD WAS</span><strong>{answer.toUpperCase()}</strong><span className="word-reveal-meaning">{WORD_MEANINGS[answer]}</span></div>}

      <section id="keyboard" className="keyboard" aria-label="On-screen keyboard">
        {KEY_ROWS.map((keys, rowIndex) => <div className="keyboard-row" key={rowIndex}>{keys.map((key) => {
          const state = keyboardStates[key];
          const label = key === "enter" ? "Enter" : key === "back" ? "⌫" : key;
          return <button type="button" className={`key ${key === "enter" || key === "back" ? "key--wide" : ""} ${state ? `key--${state}` : ""}`} aria-label={key === "back" ? "Backspace" : label} key={key} onClick={() => handleKey(key)}>{label}</button>;
        })}</div>)}
      </section>

      <button type="button" className="new-game" onClick={() => newGame()}><span aria-hidden="true">↻</span> New game</button>
      <p className="footnote">A little word. A lot of nerve.</p>
    </main>
  );
}