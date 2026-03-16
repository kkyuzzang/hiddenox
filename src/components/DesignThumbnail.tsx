import React from 'react';

interface DesignThumbnailProps {
  grid: number[][];
  size?: number;
}

export default function DesignThumbnail({ grid, size = 80 }: DesignThumbnailProps) {
  if (!grid || grid.length === 0 || !grid[0]) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const cellSize = size / cols;

  return (
    <div 
      className="bg-stone-50 border-2 border-stone-300 rounded overflow-hidden shadow-inner flex flex-col"
      style={{ 
        width: `${size}px`,
        height: `${cellSize * rows}px`
      }}
    >
      {grid.map((row, r) => (
        <div key={r} className="flex w-full" style={{ height: `${cellSize}px` }}>
          {row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              className="h-full"
              style={{
                width: `${cellSize}px`,
                backgroundColor: cell === 1 ? '#1c1917' : 'transparent', // stone-900
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
