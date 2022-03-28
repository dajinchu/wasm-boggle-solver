import React, { useRef, useState } from "react";
import { Cell } from "./Cell";

const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
const REGEX = /^[A-Za-z]$/;

export function Board({ width, height, path, onChange: reportChange }) {
  const [chars, setChars] = useState({});
  const cellsRef = useRef({});
  const word = path.map((i) => chars[i]).join("");

  function recalculateChars() {
    let newChars = objectMap(
      cellsRef.current,
      (_, k) => cellsRef.current[k]?.value
    );
    setChars(newChars);
    reportChange(newChars);
  }

  function focus(row, col) {
    cellsRef.current[[row, col]]?.focus();
  }
  function onKeyDown({ target, key }, row, col) {
    if (key === "Backspace") {
      if (target.value === "" && target.previousElementSibling !== null) {
        target.previousElementSibling.value = "";
        focus(row, col - 1);
      } else {
        target.value = "";
      }
      recalculateChars();
    } else if (key === "ArrowLeft") {
      focus(row, col - 1);
    } else if (key === "ArrowRight" || key === " ") {
      focus(row, col + 1);
    } else if (key === "ArrowUp") {
      focus(row - 1, col);
    } else if (key === "ArrowDown") {
      focus(row + 1, col);
    } else if (key === "Enter") {
      const leftMost = Math.min(
        0,
        ...Object.entries(cellsRef.current)
          .filter(([k, v]) => !!v.value)
          .map(([k, _]) => parseInt(k.split(",")[0]))
      );
      focus(row + 1, leftMost);
    }
  }
  function onChange({ target }, row, col) {
    if (target.value.match(REGEX)) {
      focus(row, col + 1);
      target.value = target.value.toUpperCase();
      recalculateChars();
    } else {
      target.value = chars[[row, col]];
    }
  }
  return (
    <div>
      <div className="py-2 text-xl">The word: {word}</div>
      {Array(height)
        .fill()
        .map((_, row) => (
          <div key={row} className="flex flex-row">
            {Array(width)
              .fill()
              .map((_, col) => (
                <Cell
                  key={col}
                  autofocus={row==0&&col==0}
                  highlight={!!path.find(([r, c]) => r === row && c === col)}
                  value={chars[[row, col]]}
                  onKeyDown={(e) => onKeyDown(e, row, col)}
                  onChange={(e) => onChange(e, row, col)}
                  ref={(el) => (cellsRef.current[[row, col]] = el)}
                />
              ))}
          </div>
        ))}
    </div>
  );
}
