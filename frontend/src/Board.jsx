import React, { useRef, useState, useEffect } from "react";
import { Cell } from "./Cell";

const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
const REGEX = /^[A-Za-z]$/;

function randomBoard(width, height) {
  const board = {};
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      board[[row, col]] = String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );
    }
  }
  return board;
}

export function Board({ width, height, path, onChange: reportChange }) {
  const [chars, setChars] = useState({});
  const cellsRef = useRef({});
  const word = path.map((i) => chars[i]).join("");

  function setChar(row, col, char) {
    setChars((chars) => ({ ...chars, [[row, col]]: char }));
  }

  useEffect(() => {
    reportChange(chars);
  }, [Object.values(chars).join(",")]);

  function focus(row, col) {
    cellsRef.current[[row, col]]?.focus();
  }
  function onKeyDown({ target, key }, row, col) {
    if (key === "Backspace") {
      if (target.value === "" && target.previousElementSibling !== null) {
        setChar(row, col - 1, "");
        focus(row, col - 1);
      } else {
        setChar(row, col, "");
      }
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
      setChar(row, col, target.value.toUpperCase());
    } else {
      target.value = chars[[row, col]];
      target.select();
    }
  }
  return (
    <div>
      <div className="flex flex-row items-center py-2">
        <div className="text-xl">The word: {word}</div>
        <button
          onClick={() => {
            setChars({});
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setChars(randomBoard(width, height));
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
        >
          Randomize
        </button>
      </div>
      {Array(height)
        .fill()
        .map((_, row) => (
          <div key={row} className="flex flex-row">
            {Array(width)
              .fill()
              .map((_, col) => {
                const idx = path.findIndex(([r, c]) => r === row && c === col);
                const prev = idx !== -1 && path[idx - 1];
                const next = idx !== -1 && path[idx + 1];
                return (
                  <Cell
                    key={col}
                    autofocus={row == 0 && col == 0}
                    pathIn={!!prev && [prev[0] - row, prev[1] - col]}
                    pathOut={!!next && [next[0] - row, next[1] - col]}
                    value={chars[[row, col]] || ""}
                    onKeyDown={(e) => onKeyDown(e, row, col)}
                    onChange={(e) => onChange(e, row, col)}
                    ref={(el) => (cellsRef.current[[row, col]] = el)}
                  />
                );
              })}
          </div>
        ))}
    </div>
  );
}
