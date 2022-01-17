import styles from "../styles/Home.module.css";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { useChess } from "../hooks/chess";
import { MoveResponseStatus, OpponentType } from "../types";
import { useOpponent } from "../hooks/opponent";
import { PhoenixSocketProvider } from "../hooks/phoenix";

const KEY_ENTER = "Enter";

// just focus on the behavior
// how to implement the remote player?
// click the type-to-move from the homepage.
// => click matchmaking or stockfish card
// => if clicking matchmaking, join type-to-move:lobby
// => => server needs to be able to identify each user connected
// => => some kind of token? should be no need... should have a socket struct for each connection
// => => should be something like a name recognized by the server though... might be easier to get the token running
// => => using Presence (?) should be able to list out all the users connected to the same channel
// => => without persistence, no concept of ELO-based matchmaking
// => => instead just wait until >= 2 in the lobby, grab the 2 oldest connections and send them both a redirect
// => => private channels should block new connections if 2 are already connected
// => => server needs to then start simulating a chess match and assign each socket to a piece color
// => => when receiving messages from each socket... when not legit send error back to socket (with current FEN to reset)
// => => when legit, broadcast move to both sockets and wait for next one
// => => whats the UX? user clicks matchmaking... waits for another player to show up (WS message)
// => wait for message from backend to redirect to other channel
// => when receiving the message, connect to the channel
// => receive initial state from server (are you white/black)
// =>

const TypeToMoveGame = () => {
  const { sendMove, receiveMove } = useOpponent(OpponentType.REMOTE_PLAYER);
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
    sendMove({
      fen: getFen(),
      lastMove: parseResult.move,
    });
    const opponentResponse = await receiveMove();
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
};

export default function TypeToMove({ websocketUrl }: { websocketUrl: string }) {
  return (
    <PhoenixSocketProvider
      endpoint={websocketUrl}
      options={{ params: { name: "Evan" } }}
    >
      <TypeToMoveGame />
    </PhoenixSocketProvider>
  );
}

export async function getStaticProps(context) {
  return {
    props: { websocketUrl: process.env.WS_URL },
  };
}
