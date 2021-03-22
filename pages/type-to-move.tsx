import styles from "../styles/Home.module.css";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import { parseUci } from "chessops";
import { StockfishInterface } from "../types";
import { useChess } from "../hooks/chess";

const KEY_ENTER = "Enter";

export default function TypeToMove() {
  const [stockfish, setStockfish] = useState<StockfishInterface | null>(null);
  const [stockfishThinking, setStockfishThinking] = useState<boolean>(false);
  const [inputSAN, setInputSAN] = useState<string>("");
  const { play, processSAN, getFen, Board, boardRef } = useChess();

  useEffect(() => {
    (async () => {
      if (window["Stockfish"] === undefined) {
        alert("Failed to load Stockfish.");
        return;
      }
      const _stockfish: StockfishInterface = await window["Stockfish"]();
      _stockfish.addMessageListener((line) => {
        console.log(line);
        if (line.startsWith("bestmove")) {
          const bestMove = parseUci(line.split(" ")[1]);
          if (bestMove !== null) {
            play(bestMove);
            setStockfishThinking(false);
          }
        }
      });
      _stockfish.postMessage("uci");
      _stockfish.postMessage("ucinewgame");
      _stockfish.postMessage("isready");
      setStockfish(_stockfish);
    })();
  }, []);

  const getStockfishMove = () => {
    if (stockfish === null) {
      alert("Stockfish failed to initialize.");
      return null;
    }
    stockfish.postMessage(`position fen ${getFen()}`);
    stockfish.postMessage("go movetime 1000");
    setStockfishThinking(true);
  };

  const handleUserMove = () => {
    const parseResult = processSAN(inputSAN);
    setInputSAN("");
    if (parseResult.valid === false) {
      alert(parseResult.message);
      return;
    }
    play(parseResult.move);
    getStockfishMove();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chess Break</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="/stockfish/stockfish.js" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Type-to-move</h1>

        <p className={styles.description}>
          Type a valid SAN move to play a game of chess.
        </p>
        <p>{stockfishThinking ? " (stockfish is thinking...)" : "Your turn"}</p>

        <div className={styles.grid}>
          <Board viewOnly ref={boardRef} />
          <div style={{ marginLeft: "1rem" }}>
            <input
              type="text"
              value={inputSAN}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setInputSAN(event.target.value)
              }
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === KEY_ENTER) {
                  handleUserMove();
                }
              }}
            />
            <button onClick={handleUserMove}>Submit</button>
          </div>
        </div>
      </main>
    </div>
  );
}
