import React, { useCallback, useRef, useEffect } from 'react';

interface StudentGridProps {
  grid: number[][];
  coloredCells: Set<string>;
  onCellAction: (row: number, col: number) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
}

export default function StudentGrid({ 
  grid, 
  coloredCells, 
  onCellAction, 
  isDrawing, 
  setIsDrawing 
}: StudentGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellData = element?.getAttribute('data-cell');
    if (cellData) {
      const [r, c] = cellData.split('-').map(Number);
      onCellAction(r, c);
    }
  }, [onCellAction]);

  const handleMouseDown = (r: number, c: number) => {
    setIsDrawing(true);
    onCellAction(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing) {
      onCellAction(r, c);
    }
  };

  // Global mouse up to stop drawing
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [setIsDrawing]);

  return (
    <div 
      ref={gridRef}
      className="grid gap-[1px] select-none touch-none bg-stone-800 p-[1px] rounded-lg border-2 border-stone-800 shadow-xl overflow-hidden"
      style={{ 
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
        aspectRatio: `${grid[0].length} / ${grid.length}`
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDrawing(false)}
    >
      {grid.map((row, r) => (
        row.map((quizId, c) => {
          const isColored = coloredCells.has(`${r}-${c}`);
          return (
            <div
              key={`${r}-${c}`}
              data-cell={`${r}-${c}`}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
              className={`
                aspect-square flex items-center justify-center text-[7px] font-bold transition-all duration-75
                ${isColored 
                  ? 'bg-stone-900 text-white/20' 
                  : 'bg-white text-stone-300 hover:bg-stone-50'}
              `}
            >
              {quizId}
            </div>
          );
        })
      ))}
    </div>
  );
}
