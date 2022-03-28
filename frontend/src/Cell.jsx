import React from "react";

export const Cell = React.forwardRef(function Cell(
  { autofocus, onKeyDown, onChange, value, highlight },
  ref
) {
  const bg = highlight
    ? "bg-yellow-500"
    : !!value
    ? "bg-white"
    : "bg-stone-800";
  return (
    <input
      autoFocus={autofocus}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onFocus={({ target }) => {
        setTimeout(() => target.activeElement && target.select(), 0);
      }}
      maxLength="1"
      className={`w-20 h-20 border border-stone-300 focus:outline-none text-center text-4xl ${bg} focus:bg-slate-400`}
      ref={ref}
    />
  );
});
