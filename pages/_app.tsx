import "../styles/globals.css";
import { PhoenixSocketProvider } from "../hooks/phoenix";

function MyApp({ Component, pageProps }) {
  return (
    // TODO: need to make this an environment variable
    <PhoenixSocketProvider endpoint="ws://localhost:4000/socket">
      <Component {...pageProps} />
    </PhoenixSocketProvider>
  );
}

export default MyApp;
