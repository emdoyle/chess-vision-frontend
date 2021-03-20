import { useChannel } from "../hooks/phoenix";
import { useEffect } from "react";

export const ChatLobby = () => {
  const lobby = useChannel({ topic: "room:lobby" });
  useEffect(() => {
    if (lobby === null) {
      return;
    }
    const chatInput = document.querySelector("#chat-input");
    const messagesContainer = document.querySelector("#messages");

    chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        lobby.push("new_msg", { body: chatInput.value });
        chatInput.value = "";
      }
    });

    lobby.on("new_msg", (payload) => {
      const messageItem = document.createElement("p");
      messageItem.innerText = `[${Date()}] ${payload.body}`;
      messagesContainer.appendChild(messageItem);
    });
  }, [lobby]);

  return (
    <>
      <div id="messages" role="log" aria-live="polite" />
      <input id="chat-input" type="text" />
    </>
  );
};
