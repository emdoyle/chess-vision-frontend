import { Chess, parseSquare, SquareName } from "chessops";
import { chessgroundDests } from "chessops/compat";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { useState } from "react";

export const ChessBoard = () => {
  const [chess, _] = useState<Chess>(Chess.default());
  const [dests, setDests] = useState<Map<SquareName, SquareName[]>>(
    chessgroundDests(chess)
  );
  return (
    <Chessground
      turnColor={chess.turn}
      movable={{
        free: false,
        dests: dests,
        color: chess.turn,
      }}
      onMove={(from, to) => {
        chess.play({ from: parseSquare(from), to: parseSquare(to) });
        setDests(chessgroundDests(chess));
      }}
    />
  );
};
