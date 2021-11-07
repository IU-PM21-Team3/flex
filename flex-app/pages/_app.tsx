import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import NavigationBar from "../components/NavigationBar";
import { AuthProvider } from "../contexts/authContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NavigationBar />

      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
