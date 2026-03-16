import React, { useState } from 'react';
import { DESIGNS, Design } from '../constants/designs';
import DesignThumbnail from './DesignThumbnail';
import { FileUp, Play, Settings, LayoutGrid, Printer, Download } from 'lucide-react';
import { Quiz } from '../types';
import { parseExcel } from '../utils/excelParser';
import { downloadSampleExcel } from '../utils/sampleDownloader';

interface HostCreateRoomProps {
  onCreated: (peerId: string, quizzes: Quiz[], design: Design, mode: 'online' | 'print') => void;
  error?: string;
  initialMode?: 'online' | 'print' | null;
}

export default function HostCreateRoom({ onCreated, error, initialMode }: HostCreateRoomProps) {
  const [peerId, setPeerId] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await parseExcel(file);
        setQuizzes(data.quizzes);
      } catch (err) {
        alert('엑셀 파일 파싱 중 오류가 발생했습니다.');
      }
    }
  };

  const handleAction = (mode: 'online' | 'print') => {
    const finalMode = mode || initialMode;
    if (finalMode === 'online' && !peerId.trim()) return alert('세션 코드를 입력해주세요.');
    if (quizzes.length === 0) return alert('문제 파일을 업로드해주세요.');
    if (!selectedDesign) return alert('도안을 선택해주세요.');
    onCreated(peerId.trim(), quizzes, selectedDesign, finalMode as 'online' | 'print');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Config */}
        <div className="bg-white border-2 border-stone-800 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
          <h1 className="text-3xl font-black mb-8 flex items-center gap-2 uppercase tracking-tighter">
            <Settings className="w-8 h-8" /> {initialMode === 'print' ? 'Print Setup' : 'Room Setup'}
          </h1>
          
          <div className="space-y-6">
            {initialMode !== 'print' && (
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Session Code (Online Only)</label>
                <input 
                  type="text" 
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  placeholder="예: class-101"
                  className="w-full p-4 border-2 border-stone-200 rounded-xl focus:border-stone-800 outline-none font-mono text-xl"
                />
                {error && <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-stone-400 uppercase">Quiz Excel File</label>
                <button 
                  onClick={downloadSampleExcel}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" /> 양식 샘플 다운로드
                </button>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="excel-upload"
                />
                <label 
                  htmlFor="excel-upload"
                  className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-stone-800 hover:bg-stone-50 transition-all"
                >
                  <FileUp className="w-5 h-5" />
                  <span className="font-bold">{quizzes.length > 0 ? `${quizzes.length}개 문제 로드됨` : '파일 선택 (.xlsx)'}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              {initialMode === 'print' ? (
                <button 
                  onClick={() => handleAction('print')}
                  className="w-full py-4 bg-emerald-500 text-white border-2 border-stone-800 rounded-2xl font-black text-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
                >
                  <Printer className="w-6 h-6" /> GENERATE WORKSHEET
                </button>
              ) : (
                <button 
                  onClick={() => handleAction('online')}
                  className="w-full py-4 bg-stone-900 text-stone-100 rounded-2xl font-black text-xl flex items-center justify-center gap-2 hover:bg-stone-700 transition-all active:scale-95 shadow-lg"
                >
                  <Play className="w-6 h-6 fill-current" /> CREATE ONLINE ROOM
                </button>
              )}
              
              {/* Optional: Add a way to switch mode if they changed their mind */}
              <button 
                onClick={() => window.location.reload()} 
                className="text-stone-400 text-xs font-bold uppercase hover:text-stone-600 transition-colors"
              >
                Change Mode
              </button>
            </div>
          </div>
        </div>


        {/* Right: Design Selection */}
        <div className="bg-white border-2 border-stone-800 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] flex flex-col min-h-[500px]">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
            <LayoutGrid className="w-6 h-6" /> Select Design
          </h2>
          
          <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {DESIGNS.map(design => (
              <button
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 group min-h-[160px] ${
                  selectedDesign?.id === design.id 
                    ? 'border-stone-900 bg-stone-900 text-white shadow-[4px_4px_0px_0px_rgba(28,25,23,0.2)]' 
                    : 'border-stone-100 hover:border-stone-300 bg-stone-50'
                }`}
              >
                <div className="flex-1 flex items-center justify-center">
                  <DesignThumbnail grid={design.grid} size={100} />
                </div>
                <span className="font-bold text-sm text-center">{design.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
