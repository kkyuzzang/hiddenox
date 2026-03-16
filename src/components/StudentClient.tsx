import React, { useState, useEffect } from 'react';
import { useStudentPeer } from '../hooks/useStudentPeer';
import confetti from 'canvas-confetti';
import StudentGrid from './StudentGrid';
import { Check, Send, Eraser, Paintbrush, Info, ListChecks, Loader2 } from 'lucide-react';
import Footer from './Footer';

interface StudentClientProps {
  hostId: string;
  nickname: string;
}

export default function StudentClient({ hostId, nickname }: StudentClientProps) {
  const { gameData, isConnected, sendToHost, connectToHost, error } = useStudentPeer();
  const [coloredCells, setColoredCells] = useState<Set<string>>(new Set());
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (hostId) connectToHost(hostId);
  }, [hostId, connectToHost]);

  const handleCellAction = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setColoredCells(prev => {
      const next = new Set(prev);
      if (isEraser) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (!gameData) return;

    let correctCount = 0;
    let totalCorrectNeeded = 0;
    let wrongCount = 0;

    gameData.grid.forEach((row, r) => {
      row.forEach((quizId, c) => {
        const quiz = gameData.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        const isColored = coloredCells.has(`${r}-${c}`);
        if (quiz.answer === 'O') {
          totalCorrectNeeded++;
          if (isColored) correctCount++;
        } else {
          if (isColored) wrongCount++;
        }
      });
    });

    const progress = Math.round((correctCount / totalCorrectNeeded) * 100);
    const finished = progress === 100 && wrongCount === 0;

    if (finished) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsFinished(true);
    }

    sendToHost({
      type: 'PROGRESS_UPDATE',
      nickname,
      progress,
      isFinished: finished
    });
  };

  if (error) return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white border-4 border-stone-800 p-8 rounded-3xl shadow-xl text-center">
          <p className="text-red-500 font-black text-2xl mb-4 uppercase tracking-tight">Error</p>
          <p className="text-stone-600 font-bold mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-stone-900 text-white rounded-xl font-bold">다시 시도</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!gameData) return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-16 h-16 text-stone-900 animate-spin mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Waiting...</h2>
        <p className="text-stone-500 font-bold">선생님이 퀴즈를 시작할 때까지 기다려주세요.</p>
        {isConnected && <div className="mt-4 px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase">Connected</div>}
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Mobile Header */}
      <div className="bg-stone-900 text-stone-100 p-4 flex justify-between items-center sticky top-0 z-20 shadow-lg">
        <div className="font-black tracking-tight uppercase text-lg">{nickname}</div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEraser(false)}
            className={`p-3 rounded-xl transition-all active:scale-90 ${!isEraser ? 'bg-emerald-500 text-white shadow-inner' : 'bg-stone-800 text-stone-400'}`}
          >
            <Paintbrush size={24} />
          </button>
          <button 
            onClick={() => setIsEraser(true)}
            className={`p-3 rounded-xl transition-all active:scale-90 ${isEraser ? 'bg-red-500 text-white shadow-inner' : 'bg-stone-800 text-stone-400'}`}
          >
            <Eraser size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 lg:flex lg:overflow-hidden">
        {/* Left/Top: Quiz List */}
        <div className="lg:w-1/2 lg:overflow-y-auto p-4 space-y-4 border-r-2 border-stone-200 bg-stone-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-stone-400 uppercase flex items-center gap-1 tracking-widest">
              <ListChecks size={14} /> Quiz List
            </h3>
            <span className="text-[10px] font-black bg-stone-200 px-2 py-0.5 rounded-full uppercase">Total {gameData.quizzes.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {gameData.quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white p-5 rounded-2xl border-2 border-stone-200 flex items-start gap-4 shadow-sm hover:border-stone-400 transition-colors">
                <div className="bg-stone-900 text-stone-100 w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-lg shadow-md">
                  {quiz.id}
                </div>
                <p className="text-stone-800 font-bold leading-tight pt-1 text-lg">{quiz.question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right/Bottom: Grid */}
        <div className="lg:w-1/2 p-4 flex flex-col space-y-6 lg:overflow-y-auto bg-stone-100">
          <div className="bg-white p-6 rounded-3xl border-4 border-stone-800 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-stone-400 uppercase flex items-center gap-1 tracking-widest">
                <Info size={14} /> Pixel Art Grid
              </h3>
              <div className="text-[10px] font-black text-stone-400 uppercase">Drag to Color</div>
            </div>
            <StudentGrid 
              grid={gameData.grid}
              coloredCells={coloredCells}
              onCellAction={handleCellAction}
              isDrawing={isDrawing}
              setIsDrawing={setIsDrawing}
            />
          </div>
          
          <div className="pb-24 lg:pb-4">
            <button 
              onClick={handleSubmit}
              disabled={isFinished}
              className={`w-full py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 border-4 border-stone-800
                ${isFinished ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-stone-100 hover:bg-stone-700'}
              `}
            >
              {isFinished ? <><Check className="w-8 h-8" /> COMPLETE!</> : <><Send size={24} /> SUBMIT ANSWER</>}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


