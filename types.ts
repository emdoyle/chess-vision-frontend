export interface StockfishInterface {
  addMessageListener: (listener: (line: string) => void) => void;
  postMessage: (message: string) => void;
}
