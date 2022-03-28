import React, { useEffect, useState } from "react";
import { Board } from "./Board";
import { init, Solver } from "wasm-boggle-solver";

export function App() {
  const width = 20;
  const height = 20;
  const [path, setPath] = useState([]);

  useEffect(() => setTimeout(() => init(), 0), []);
  return (
    <Board
      width={width}
      height={height}
      path={path}
      onChange={(e) => {
        let str = "";

        Array(height)
          .fill()
          .forEach((_, row) => {
            Array(width)
              .fill()
              .forEach((_, col) => (str += e[[row, col]] || " "));
            str += "\n";
          });
        setTimeout(() => {
          const solver = Solver.new();
          solver.solve(str.toLowerCase());
          setPath(
            solver
              .path()
              .split("|")
              .map((x) => x.split(",").map((x) => parseInt(x)))
          );
        }, 0);
      }}
    />
  );
}
