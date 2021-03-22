import { OpponentStateHook } from "./opponent";
import {
  MoveResponseStatus,
  MoveState,
  OpponentMoveResponse,
  StockfishInterface,
} from "../types";
import { parseUci } from "chessops";
import { useEffect, useState } from "react";
import { sleep } from "../util";

const MOVE_TIME = 1000; // ms
const MOVE_BUFFER = 50; // ms

export const useStockfishOpponent: OpponentStateHook = () => {
  const [stockfish, setStockfish] = useState<StockfishInterface | null>(null);
  useEffect(() => {
    (async () => {
      if (window["Stockfish"] === undefined) {
        alert("Failed to load Stockfish.");
        return;
      }
      const _stockfish: StockfishInterface = await window["Stockfish"]();
      _stockfish.postMessage("uci");
      _stockfish.postMessage("ucinewgame");
      _stockfish.postMessage("isready");
      setStockfish(_stockfish);
    })();
  }, []);

  const exchangeMoves: (
    moveState: MoveState
  ) => Promise<OpponentMoveResponse> = async (moveState: MoveState) => {
    if (stockfish === null) {
      alert("Stockfish failed to initialize, cannot exchange moves.");
      return { status: MoveResponseStatus.CONN_ERROR };
    }
    let stockfishMove = null;
    // This attaches a listener to stockfish and creates a closure around a local variable
    // to retrieve the best move.
    const tempListener = (line: string) => {
      if (line.startsWith("bestmove")) {
        stockfishMove = parseUci(line.split(" ")[1]);
      }
    };
    stockfish.addMessageListener(tempListener);
    stockfish.postMessage(`position fen ${moveState.fen}`);
    stockfish.postMessage(`go movetime ${MOVE_TIME}`);
    await sleep(MOVE_TIME);
    stockfish.postMessage("stop");
    await sleep(MOVE_BUFFER);
    stockfish.removeMessageListener(tempListener);
    if (stockfishMove === null) {
      return { status: MoveResponseStatus.CONN_ERROR };
    }
    return { status: MoveResponseStatus.OK, move: stockfishMove };
  };

  return { exchangeMoves };
};
