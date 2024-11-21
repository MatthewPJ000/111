"use client"
// ThemeButton.tsx
import React, { useEffect, useState } from "react";

const themes = [
  "nord",
  "garden",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "retro",
  "valentine",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "cmyk",
  "autumn",
  "acid",
  "lemonade",
  "winter",
  
];

export default function ThemeButton() {
  const [theme, setTheme] = useState<string>("nord"); // Default theme

  useEffect(() => {
    // Ensure this runs on the client only
    const savedTheme = localStorage.getItem("theme") || "nord";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Save to localStorage
  };

  return (
    <div className="flex items-center space-x-2 mr-10">
      <label htmlFor="theme-selector" className="text-lg">
        Themes:
      </label>
      <select
        id="theme-selector"
        value={theme}
        onChange={(e) => changeTheme(e.target.value)}
        className="select select-bordered select-sm w-full max-w-xs"
      >
        {themes.map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
