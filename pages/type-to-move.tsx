import styles from "../styles/Home.module.css";
import Head from "next/head";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Chess, Move, parseUci } from "chessops";
import { parseSan } from "chessops/san";
import { chessgroundMove } from "chessops/compat";
import { makeFen } from "chessops/fen";
import { StockfishInterface } from "../types";

const KEY_ENTER = "Enter";

export default function TypeToMove() {
  // TODO: 'Chess' object in state doesn't reset on hot reload, but 'Chessground' element loses state (out-of-sync)
  const [chess, _] = useState<Chess>(Chess.default());
  const [stockfish, setStockfish] = useState<StockfishInterface | null>(null);
  const [stockfishThinking, setStockfishThinking] = useState<boolean>(false);
  const chessground = useRef<Chessground | null>(null);
  const [inputSAN, setInputSAN] = useState<string>("");

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
            playMove(bestMove);
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

  const processSAN = (moveSAN: string) => {
    try {
      const move = parseSan(chess, moveSAN);
      if (move === undefined) {
        alert(
          `That move code (${moveSAN}) is not valid for this position. Please try again.`
        );
        return null;
      }
      if (move["from"] === undefined) {
        console.log(move);
        alert("Drop moves are not allowed in this mode.");
        return null;
      }
      return move;
    } catch (error) {
      alert("An unknown error occurred.");
      console.log("SAN submission error", error);
    } finally {
      setInputSAN("");
    }
  };

  const getStockfishMove = (move: Move) => {
    console.log("Sending user move to stockfish...");
    if (stockfish === null) {
      alert("Stockfish failed to initialize.");
      return null;
    }
    stockfish.postMessage(`position fen ${makeFen(chess.toSetup())}`);
    stockfish.postMessage("go movetime 1000");
    setStockfishThinking(true);
  };

  const handleUserMove = () => {
    const move = processSAN(inputSAN);
    if (move === null) return;
    playMove(move);
    getStockfishMove(move);
  };

  const playMove = (move: Move) => {
    chess.play(move);
    const cgMove = chessgroundMove(move);
    chessground.current.cg.move(...cgMove);
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
          <Chessground viewOnly turnColor={chess.turn} ref={chessground} />
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
