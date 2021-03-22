import { Move } from "chessops";

export interface StockfishInterface {
  addMessageListener: (listener: (line: string) => void) => void;
  removeMessageListener: (listener: (line: string) => void) => void;
  postMessage: (message: string) => void;
}

export type MoveState = {
  fen: string;
  lastMove: Move;
};

export enum MoveResponseStatus {
  OK = 1,
  FEN_ERROR = 2,
  MOVE_ERROR = 3,
  CONN_ERROR = 4,
}

type ResponseErrorStatus = Exclude<MoveResponseStatus, MoveResponseStatus.OK>;

export type OpponentMoveValidResponse = {
  status: MoveResponseStatus.OK;
  move: Move;
};

export type OpponentMoveInvalidResponse = {
  status: ResponseErrorStatus;
};

export type OpponentMoveResponse =
  | OpponentMoveValidResponse
  | OpponentMoveInvalidResponse;

export enum OpponentType {
  STOCKFISH = 1,
  REMOTE_PLAYER = 2,
}
