import React from 'react';  // Add this import
import type { AppProps } from "next/app";
import { CategoryProvider } from '../path/to/CategoryContext';
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CategoryProvider>

      <Component {...pageProps} />
    </CategoryProvider>
  );
}

export default MyApp;
