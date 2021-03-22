import { OpponentStateHook } from "./opponent";
import { MoveResponseStatus, MoveState } from "../types";

export const useRemotePlayerOpponent: OpponentStateHook = () => {
  // TODO
  return {
    exchangeMoves: async (moveState: MoveState) => ({
      status: MoveResponseStatus.CONN_ERROR,
    }),
  };
};
