import { OpponentStateHook } from "./opponent";
import { MoveResponseStatus, MoveState } from "../types";
import { useChannel } from "./phoenix";

export const useRemotePlayerOpponent: OpponentStateHook = () => {
  const gameChannel = useChannel({ topic: "type-to-move:1" });

  const sendMove = (moveState: MoveState) => {
    gameChannel.push("move", { move: moveState.lastMove });
  };

  const receiveMove = async () => {};

  return {
    sendMove,
    receiveMove: async () => ({
      status: MoveResponseStatus.CONN_ERROR,
    }),
  };
};
