import React from 'react';
import { Quiz } from '../types';
import { Design } from '../constants/designs';
import { Printer, ArrowLeft } from 'lucide-react';

interface WorksheetPrintViewProps {
  quizzes: Quiz[];
  design: Design;
  onBack: () => void;
}

export default function WorksheetPrintView({ quizzes, design, onBack }: WorksheetPrintViewProps) {
  const oQuizzes = quizzes.filter(q => q.answer === 'O').map(q => q.id);
  const xQuizzes = quizzes.filter(q => q.answer === 'X').map(q => q.id);

  // Generate a stable mapped grid for the worksheet
  // We use a simple hash or just random but stable for this render
  const mappedGrid = design.grid.map((row, r) => 
    row.map((cell, c) => {
      // Use a simple deterministic "random" based on position to keep it stable during re-renders
      const seed = r * 1000 + c;
      if (cell === 1) {
        return oQuizzes.length > 0 ? oQuizzes[seed % oQuizzes.length] : '?';
      } else {
        return xQuizzes.length > 0 ? xQuizzes[seed % xQuizzes.length] : '?';
      }
    })
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white p-0 sm:p-8 print:p-0">
      {/* Controls - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-900 font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> 돌아가기
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-xl font-black shadow-lg hover:bg-stone-700 transition-all"
        >
          <Printer className="w-6 h-6" /> 학습지 출력하기
        </button>
      </div>

      {/* Worksheet Content */}
      <div className="max-w-[297mm] mx-auto bg-white border border-stone-200 print:border-none p-[10mm] shadow-2xl print:shadow-none h-auto print:h-[210mm] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b-2 border-stone-800 pb-3 mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Pixel Art Quiz Worksheet</h1>
            <p className="text-stone-500 font-mono text-[10px] italic">정답이 'O'인 번호를 찾아 색칠하여 그림을 완성해보세요!</p>
          </div>
          <div className="flex gap-4 text-xs font-bold">
            <div className="border-b border-stone-800 px-2 py-0.5 whitespace-nowrap">학번: ________</div>
            <div className="border-b border-stone-800 px-2 py-0.5 whitespace-nowrap">이름: ________</div>
          </div>
        </div>

        {/* Main Content Split Layout */}
        <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
          {/* Left: Questions (Two Columns) */}
          <div className="flex-[1.2] flex flex-col min-h-0">
            <h2 className="text-base font-black mb-2 border-l-4 border-stone-800 pl-2 uppercase">Questions</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 overflow-y-auto pr-2 flex-1 text-sm">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="flex gap-2 items-start leading-tight">
                  <span className="font-black min-w-[1.2rem]">{quiz.id}.</span>
                  <span className="flex-1 border-b border-stone-100 pb-0.5">{quiz.question}</span>
                  <div className="flex gap-1.5 font-bold text-stone-200 whitespace-nowrap">
                    <span>(O/X)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Grid */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-base font-black mb-2 border-l-4 border-stone-800 pl-2 uppercase">Pixel Art Grid</h2>
            <div className="flex-1 flex items-center justify-center bg-stone-50/50 rounded-xl border border-stone-100 p-4">
              <div 
                className="inline-grid border border-stone-800 bg-white shadow-sm"
                style={{ 
                  gridTemplateColumns: `repeat(${design.grid[0].length}, 1fr)`,
                  width: '100%',
                  maxWidth: '120mm',
                  aspectRatio: `${design.grid[0].length} / ${design.grid.length}`
                }}
              >
                {mappedGrid.map((row, r) => (
                  row.map((val, c) => (
                    <div 
                      key={`${r}-${c}`}
                      className="border-[0.1mm] border-stone-200 flex items-center justify-center font-bold text-stone-400 leading-none"
                      style={{ 
                        fontSize: design.grid[0].length > 50 ? '3pt' : design.grid[0].length > 30 ? '5pt' : '7pt'
                      }}
                    >
                      {val}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { 
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden { display: none !important; }
          @page {
            margin: 0;
            size: A4 landscape;
          }
          html, body {
            height: 210mm;
            width: 297mm;
            overflow: hidden;
          }
        }
      `}} />
    </div>
  );
}
