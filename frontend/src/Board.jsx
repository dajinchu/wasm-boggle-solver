import React from 'react';
export function Board({ width, height }) {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // console.log(i, j);
    }
  }
  return (
    <div>
      {Array(height)
        .fill()
        .map((item) => (
          <div className="flex flex-row">
            {Array(width)
              .fill()
              .map((item) => (
                <div>item</div>
              ))}
          </div>
        ))}
    </div>
  );
}
