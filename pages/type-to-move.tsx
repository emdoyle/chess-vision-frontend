import styles from "../styles/Home.module.css";
import Head from "next/head";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { ChangeEvent, useRef, useState } from "react";
import { Chess } from "chessops";
import { parseSan } from "chessops/san";
import { chessgroundMove } from "chessops/compat";

const KEY_ENTER = "Enter";

export default function TypeToMove() {
  const [chess, _] = useState<Chess>(Chess.default());
  const chessground = useRef<Chessground>(null);
  const [inputSAN, setInputSAN] = useState<string>("");

  const submitSAN = () => {
    try {
      const move = parseSan(chess, inputSAN);
      if (move === undefined) {
        alert(
          `That move code (${inputSAN}) is not valid for this position. Please try again.`
        );
        return;
      }
      if (!move["from"]) {
        alert("Drop moves are not allowed in this mode.");
        return;
      }
      chess.play(move);
      const cgMove = chessgroundMove(move);
      chessground.current.cg.move(...cgMove);
    } catch (error) {
      alert("An unknown error occurred.");
      console.log("SAN submission error", error);
    } finally {
      setInputSAN("");
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Chess Break</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Type-to-move</h1>

        <p className={styles.description}>
          Type a valid SAN move to play a game of chess.
        </p>

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
                  submitSAN();
                }
              }}
            />
            <button onClick={submitSAN}>Submit</button>
          </div>
        </div>
      </main>
    </div>
  );
}
