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
    <div className="flex items-center gap-0.5 bg-foreground/5 border border-foreground/10 rounded-full p-1 backdrop-blur-md">
      <button
        onClick={() => changeTheme("theme-light")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "theme-light"
            ? "bg-foreground/10 text-foreground scale-105 shadow-sm border border-foreground/5"
            : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
        }`}
        title="Light Mode"
      >
        <Sun size={15} />
      </button>

      <button
        onClick={() => changeTheme("theme-brand")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "theme-brand"
            ? "bg-foreground/10 text-foreground scale-105 shadow-sm border border-foreground/5"
            : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
        }`}
        title="Brand Theme"
      >
        <Shield size={15} />
      </button>

      <button
        onClick={() => changeTheme("theme-dark-violet")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "theme-dark-violet"
            ? "bg-foreground/10 text-foreground scale-105 shadow-sm border border-foreground/5"
            : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
        }`}
        title="Violet Dark Mode"
      >
        <Palette size={15} />
      </button>
    </div>
  );
}
