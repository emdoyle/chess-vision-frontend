import { MoveState, OpponentMoveResponse, OpponentType } from "../types";
import { useStockfishOpponent } from "./stockfish";
import { useRemotePlayerOpponent } from "./remote_player";

export type OpponentState = {
  sendMove: (moveState: MoveState) => void;
  receiveMove: () => Promise<OpponentMoveResponse>;
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
