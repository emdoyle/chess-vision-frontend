import { MoveState, OpponentMoveResponse, OpponentType } from "../types";
import { useStockfishOpponent } from "./stockfish";
import { useRemotePlayerOpponent } from "./remote_player";

export type OpponentState = {
  exchangeMoves: (moveState: MoveState) => Promise<OpponentMoveResponse>;
};

export type OpponentStateHook = () => OpponentState;

const OpponentHooks = {
  [OpponentType.STOCKFISH]: useStockfishOpponent,
  [OpponentType.REMOTE_PLAYER]: useRemotePlayerOpponent,
};

export const useOpponent: (opponentType: OpponentType) => OpponentState = (
  opponentType: OpponentType
) => {
  return OpponentHooks[opponentType]();
};
