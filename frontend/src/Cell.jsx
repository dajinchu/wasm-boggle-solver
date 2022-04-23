import React from "react";

const VEC_TO_DIR = {
  [-1]: { [-1]: "NW", 0: "N", 1: "NE" },
  0: { [-1]: "W", 0: "", 1: "E" },
  1: { [-1]: "SW", 0: "S", 1: "SE" },
};

const N = <path d="M50 0 L49 0 L49 50 L50 50" fill="#aaa" />;
const NE = <path d="M50 49 L99 0 L100 1 L51 50" fill="#aaa" />;
function Path({ dir }) {
  switch (VEC_TO_DIR[dir[0]][dir[1]]) {
    case "N":
      return N;
    case "NE":
      return NE;
    case "E":
      return <g transform="rotate(90, 50, 50)">{N}</g>;
    case "SE":
      return <g transform="rotate(90, 50, 50)">{NE}</g>;
    case "S":
      return <g transform="rotate(180, 50, 50)">{N}</g>;
    case "SW":
      return <g transform="rotate(180, 50, 50)">{NE}</g>;
    case "W":
      return <g transform="rotate(270, 50, 50)">{N}</g>;
    case "NW":
      return <g transform="rotate(270, 50, 50)">{NE}</g>;
    default:
      return null;
  }
}

export const Cell = React.forwardRef(function Cell(
  { autofocus, onKeyDown, onChange, value, pathIn, pathOut },
  ref
) {
  const bg =
    pathIn || pathOut ? "bg-yellow-500" : !!value ? "bg-white" : "bg-stone-800";
  return (
    <div className="relative">
      <input
        autoFocus={autofocus}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onFocus={({ target }) => {
          setTimeout(
            () => document.activeElement === target && target.select(),
            0
          );
        }}
        value={value}
        maxLength="1"
        className={`w-20 h-20 border border-stone-300 focus:outline-none text-center text-4xl ${bg} focus:bg-slate-400`}
        ref={ref}
      />
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {!!pathIn && <Path dir={pathIn} />}
          {!!pathOut && <Path dir={pathOut} />}
        </svg>
      </div>
    </div>
  );
});
