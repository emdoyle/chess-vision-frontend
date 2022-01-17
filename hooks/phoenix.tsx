import { Channel, Socket } from "phoenix";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const PhoenixSocketContext = createContext<Socket | undefined>(undefined);

// TODO: still think there is a possible issue of dangling sockets/channels

export const PhoenixSocketProvider = ({
  endpoint,
  options,
  children,
}: {
  endpoint: string;
  options?: Record<string, any>;
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const _socket = new Socket(endpoint, options ?? {});
    setSocket(_socket);
  }, [endpoint, options]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.connect();
    return () => socket.disconnect();
  }, [socket]);

  return (
    <PhoenixSocketContext.Provider value={socket}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext<Socket>(PhoenixSocketContext);
  if (socket === undefined) {
    throw new Error(
      "usePhoenixSocket must be used within PhoenixSocketContext"
    );
  }
  return socket;
};

export const useChannel = ({ topic, params }: { topic: string; params? }) => {
  const socket = useSocket();
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    const _channel = socket.channel(topic, params ?? {});
    setChannel(_channel);
  }, [socket, topic, params]);

  useEffect(() => {
    if (channel === null) {
      return;
    }
    channel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined channel successfully", resp);
      })
      .receive("error", (resp) => {
        console.log("Unable to join channel", resp);
      });
    return () =>
      channel.leave().receive("ok", () => console.log("Left channel"));
  }, [channel]);

  return channel;
};
