"use client";

import { useEffect, useState } from "react";
import { Sun, Shield, Moon, Palette } from "lucide-react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("theme-brand");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") || "theme-brand";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("app-theme", newTheme);
  };

  return (
    <div className="flex items-center gap-0.5 bg-foreground/10 border border-foreground/15 rounded-full p-1 backdrop-blur-md shadow-sm">
      <button
        onClick={() => changeTheme("theme-light")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "theme-light"
            ? "bg-primary/20 text-primary scale-105 shadow-sm border border-primary/30"
            : "text-foreground/60 hover:text-foreground hover:bg-foreground/10 hover:scale-110 active:scale-95"
        }`}
        title="Light Mode"
      >
        <Sun size={15} />
      </button>

      <button
        onClick={() => changeTheme("theme-brand")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "theme-brand"
            ? "bg-primary/20 text-primary scale-105 shadow-sm border border-primary/30"
            : "text-foreground/60 hover:text-foreground hover:bg-foreground/10 hover:scale-110 active:scale-95"
        }`}
        title="Brand Theme"
      >
        <Shield size={15} />
      </button>

      <button
        onClick={() => changeTheme("theme-dark-violet")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "theme-dark-violet"
            ? "bg-primary/20 text-primary scale-105 shadow-sm border border-primary/30"
            : "text-foreground/60 hover:text-foreground hover:bg-foreground/10 hover:scale-110 active:scale-95"
        }`}
        title="Violet Dark Mode"
      >
        <Palette size={15} />
      </button>
    </div>
  );
}
