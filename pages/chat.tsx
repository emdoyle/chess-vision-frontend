import { PhoenixSocketProvider } from "../hooks/phoenix";
import { ChatLobby } from "../components/ChatLobby";

export default function Chat({ websocketUrl }: { websocketUrl: string }) {
  return (
    <PhoenixSocketProvider endpoint={websocketUrl}>
      <ChatLobby />
    </PhoenixSocketProvider>
  );
}

export async function getStaticProps(context) {
  return {
    props: { websocketUrl: process.env.WS_URL },
  };
}
