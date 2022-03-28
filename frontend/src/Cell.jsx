import React from "react";

export const Cell = React.forwardRef(function Cell(
  { onKeyDown, onChange, value, highlight },
  ref
) {
  const bg = highlight
    ? "bg-yellow-500"
    : !!value
    ? "bg-white"
    : "bg-stone-800";
  return (
    <input
      onKeyDown={onKeyDown}
      onChange={onChange}
      onFocus={({ target }) => {
        console.log("focus")
        setTimeout(() => target === document.activeElement && target.select(), 0);
      }}
      maxLength="1"
      className={`w-20 h-20 border border-stone-300 focus:outline-none text-center text-4xl ${bg} focus:bg-slate-400`}
      ref={ref}
    />
  );
});
