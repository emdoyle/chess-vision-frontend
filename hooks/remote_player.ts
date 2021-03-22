import { OpponentStateHook } from "./opponent";
import { MoveResponseStatus, MoveState } from "../types";

export const useRemotePlayerOpponent: OpponentStateHook = () => {
  // TODO
  return {
    sendMove: (moveState: MoveState) => null,
    receiveMove: async () => ({
      status: MoveResponseStatus.CONN_ERROR,
    }),
  };
};
