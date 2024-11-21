import "../styles/globals.css";
import Navbar from "../components/navbar";
import ThemeButton from "../components/ThemeButton";
import React from 'react';
import { CategoryProvider } from './path/to/CategoryContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative bg-base-100 text-base-content">
        <Navbar ThemeButton={<ThemeButton />} />
       
        <CategoryProvider>
          {children}
        </CategoryProvider>
      </body>
    </html>
  );
}
