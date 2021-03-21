import { PhoenixSocketProvider } from "../hooks/phoenix";
import { ChatLobby } from "../components/ChatLobby";

export default function Chat() {
  return (
    <PhoenixSocketProvider endpoint="ws://localhost:4000/socket">
      <ChatLobby />
    </PhoenixSocketProvider>
  );
}
