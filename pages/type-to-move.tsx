import styles from "../styles/Home.module.css";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { useChess } from "../hooks/chess";
import { MoveResponseStatus, OpponentType } from "../types";
import { useOpponent } from "../hooks/opponent";

const KEY_ENTER = "Enter";

export default function TypeToMove() {
  const { exchangeMoves } = useOpponent(OpponentType.STOCKFISH);
  const [opponentThinking, setOpponentThinking] = useState<boolean>(false);
  const [inputSAN, setInputSAN] = useState<string>("");
  const { play, processSAN, getFen, Board, boardRef } = useChess();

  const handleUserMove = async () => {
    const parseResult = processSAN(inputSAN);
    setInputSAN("");
    if (parseResult.valid === false) {
      alert(parseResult.message);
      return;
    }
    play(parseResult.move);
    setOpponentThinking(true);
    const opponentResponse = await exchangeMoves({
      fen: getFen(),
      lastMove: parseResult.move,
    });
    if (opponentResponse.status === MoveResponseStatus.OK) {
      play(opponentResponse.move);
    } else {
      alert(
        `Failed to exchange moves with opponent. Error code: ${opponentResponse.status}`
      );
    }
    setOpponentThinking(false);
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
        <p>{opponentThinking ? " (stockfish is thinking...)" : "Your turn"}</p>

        <div className={styles.grid}>
          <Board viewOnly ref={boardRef} />
          <div style={{ marginLeft: "1rem" }}>
            <input
              type="text"
              value={inputSAN}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setInputSAN(event.target.value)
              }
              onKeyDown={async (
                event: React.KeyboardEvent<HTMLInputElement>
              ) => {
                if (event.key === KEY_ENTER) {
                  await handleUserMove();
                }
              }}
            />
            <button onClick={async () => await handleUserMove()}>Submit</button>
          </div>
        </div>
      </main>
    </div>
  );
}
