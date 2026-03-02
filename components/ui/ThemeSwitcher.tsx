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
    <div className="flex items-center gap-2 bg-glass border border-white/10 rounded-full p-1 backdrop-blur-md">
      <button
        onClick={() => changeTheme("theme-light")}
        className={`p-2 rounded-full transition-all ${
          theme === "theme-light"
            ? "bg-primary text-background shadow-lg scale-110"
            : "text-foreground/60 hover:text-foreground hover:bg-white/5"
        }`}
        title="Light Mode"
      >
        <Sun size={18} />
      </button>

      <button
        onClick={() => changeTheme("theme-brand")}
        className={`p-2 rounded-full transition-all ${
          theme === "theme-brand"
            ? "bg-primary text-background shadow-lg scale-110"
            : "text-foreground/60 hover:text-foreground hover:bg-white/5"
        }`}
        title="Brand Theme"
      >
        <Shield size={18} />
      </button>

      <button
        onClick={() => changeTheme("theme-dark-violet")}
        className={`p-2 rounded-full transition-all ${
          theme === "theme-dark-violet"
            ? "bg-primary text-background shadow-lg scale-110"
            : "text-foreground/60 hover:text-foreground hover:bg-white/5"
        }`}
        title="Violet Dark Mode"
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
