import { Chess, Move } from "chessops";
import "react-chessground/dist/styles/chessground.css";
import Chessground from "react-chessground";
import { FC, Ref, useRef, useState } from "react";
import { makeFen } from "chessops/fen";
import { chessgroundMove } from "chessops/compat";
import { makeSan, parseSan } from "chessops/san";

type ValidMove = {
  valid: true;
  move: Move;
};

type InvalidMove = {
  valid: false;
  message: string;
};

type ParseMoveResult = ValidMove | InvalidMove;

type ChessBoard = FC<Chessground.propTypes>;

type ChessState = {
  play: (move: Move) => void;
  processSAN: (moveSAN: string) => ParseMoveResult;
  getFen: () => string;
  gameStatus: string;
  Board: ChessBoard;
  boardRef: Ref<Chessground>;
};

type ChessStateHook = () => ChessState;

export const useChess: ChessStateHook = () => {
  const [chess, _setChess] = useState<Chess>(Chess.default());
  const [gameStatus, _setGameStatus] = useState<string>(""); // TODO: enum
  const boardRef = useRef<Chessground | null>(null);

  const getFen = () => {
    return makeFen(chess.toSetup());
  };

  const play = (move: Move) => {
    if (boardRef === null) {
      alert("Failed to mount chess board.");
      return;
    }
    if (!chess.isLegal(move)) {
      alert(`${makeSan(chess, move)} is an illegal move in this position.`);
      return;
    }
    chess.play(move);
    const cgMove = chessgroundMove(move);
    boardRef.current.cg.move(...cgMove);
  };

  const processSAN: (moveSAN: string) => ParseMoveResult = (
    moveSAN: string
  ) => {
    try {
      const move = parseSan(chess, moveSAN);
      if (move === undefined) {
        return {
          valid: false,
          message: `That move code (${moveSAN}) is not valid for this position. Please try again.`,
        };
      }
      if (move["from"] === undefined) {
        return {
          valid: false,
          message: "Drop moves are not allowed in this mode.",
        };
      }
      return { valid: true, move: move };
    } catch (error) {
      return { valid: false, message: "An unknown error occurred." };
    }
  };

  return { play, processSAN, getFen, gameStatus, Board: Chessground, boardRef };
};
