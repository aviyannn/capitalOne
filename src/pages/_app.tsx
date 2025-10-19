import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  // No StarButton or other UI elements here
  return <Component {...pageProps} />;
}
