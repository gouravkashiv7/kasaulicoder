import { useRef } from "react";

/**
 * Stable React keys for rows in an editable list whose items are plain values
 * (strings, or objects with no id). Using the array index as a key makes React
 * reuse the wrong DOM node when a row in the middle is removed.
 *
 * Call `removeKey(index)` alongside removing the row; new rows get fresh keys
 * automatically when the list grows.
 */
export function useRowKeys(length: number) {
  const nextId = useRef(0);
  const keys = useRef<string[]>([]);

  while (keys.current.length < length) {
    keys.current.push(`row-${nextId.current++}`);
  }
  if (keys.current.length > length) {
    keys.current.length = length;
  }

  return {
    keys: keys.current,
    removeKey: (index: number) => {
      keys.current.splice(index, 1);
    },
  };
}
