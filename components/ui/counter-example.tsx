"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Counter Example Component
 * Provided as part of the initial codebase request.
 */
export const CounterExample = () => {
  const [count, setCount] = useState(0);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 p-4 rounded-lg bg-card text-card-foreground border border-border shadow-sm",
      )}
    >
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button
          onClick={() => setCount((prev) => prev - 1)}
          className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
        >
          -
        </button>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CounterExample;
