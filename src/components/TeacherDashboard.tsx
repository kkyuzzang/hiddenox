import React, { useState, useEffect } from 'react';
import { useHostPeer } from '../hooks/useHostPeer';
import { StudentProgress, Quiz } from '../types';
import { Users, Trophy, BarChart3, ArrowLeft } from 'lucide-react';
import HostCreateRoom from './HostCreateRoom';
import WorksheetPrintView from './WorksheetPrintView';
import Footer from './Footer';
import { mapDesignToQuizzes } from '../utils/mapping';
import { Design } from '../constants/designs';

interface TeacherDashboardProps {
  initialMode?: 'online' | 'print' | null;
}

export default function TeacherDashboard({ initialMode }: TeacherDashboardProps) {
  const { myId, connections, messages, broadcast, initHost, error, setError } = useHostPeer();
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [printData, setPrintData] = useState<{ quizzes: Quiz[], design: Design } | null>(null);
  const [studentStats, setStudentStats] = useState<Record<string, StudentProgress>>({});
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleCreateRoom = (id: string, quizzes: Quiz[], design: Design, mode: 'online' | 'print') => {
    if (mode === 'print') {
      setPrintData({ quizzes, design });
      setIsPrintMode(true);
      return;
    }

    initHost(id);
    
    // Auto map and prepare game data
    const mappedGrid = mapDesignToQuizzes(design.grid, quizzes);
    const gameData = { quizzes, grid: mappedGrid };
    
    setIsRoomCreated(true);
    window.gameData = gameData; // Temporary global storage for broadcast
  };

  const startGame = () => {
    if (window.gameData) {
      broadcast({ type: 'GAME_DATA', data: window.gameData });
      setIsGameStarted(true);
    }
  };

  useEffect(() => {
    messages.forEach(msg => {
      if (msg.data.type === 'PROGRESS_UPDATE') {
        setStudentStats(prev => ({
          ...prev,
          [msg.from]: {
            id: msg.from,
            nickname: msg.data.nickname,
            progress: msg.data.progress,
            isFinished: msg.data.isFinished,
            coloredCells: new Set()
          }
        }));
      }
    });
  }, [messages]);

  const students = Object.values(studentStats) as StudentProgress[];
  const finishedCount = students.filter(s => s.isFinished).length;

  if (isPrintMode && printData) {
    return (
      <WorksheetPrintView 
        quizzes={printData.quizzes} 
        design={printData.design} 
        onBack={() => setIsPrintMode(false)} 
      />
    );
  }

  if (!isRoomCreated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <HostCreateRoom onCreated={handleCreateRoom} error={error} initialMode={initialMode} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b-4 border-stone-800 pb-8">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-stone-900 uppercase leading-none">
                Class Dashboard
              </h1>
              <p className="text-stone-500 font-mono mt-3 italic text-lg">
                {isGameStarted ? 'Game in Progress...' : 'Waiting for Students...'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Room Code</div>
              <div className="text-5xl font-mono font-black bg-stone-900 text-stone-100 px-6 py-2 rounded-2xl shadow-lg">
                {myId}
              </div>
            </div>
          </div>

          {!isGameStarted ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-stone-800 rounded-3xl shadow-[12px_12px_0px_0px_rgba(28,25,23,1)]">
              <Users className="w-20 h-20 mb-6 text-stone-300" />
              <h2 className="text-4xl font-black mb-2">Lobby</h2>
              <p className="text-stone-500 mb-10 text-xl">Connected: <span className="text-stone-900 font-bold">{connections.length}</span> students</p>
              
              <div className="flex flex-wrap justify-center gap-3 px-10 mb-12">
                {connections.map(conn => (
                  <div key={conn.peer} className="px-4 py-2 bg-stone-100 border-2 border-stone-800 rounded-xl font-bold text-lg animate-in fade-in zoom-in duration-300">
                    {studentStats[conn.peer]?.nickname || 'Joining...'}
                  </div>
                ))}
              </div>

              <button 
                onClick={startGame}
                disabled={connections.length === 0}
                className="px-12 py-5 bg-emerald-500 text-white border-4 border-stone-800 rounded-2xl font-black text-3xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                START QUIZ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Stats Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border-4 border-stone-800 p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-black uppercase">Stats</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-stone-400 uppercase">Students</div>
                      <div className="text-4xl font-black">{connections.length}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-400 uppercase">Finished</div>
                      <div className="text-4xl font-black text-emerald-500">{finishedCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Progress List */}
              <div className="lg:col-span-3 bg-white border-4 border-stone-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] overflow-hidden">
                <div className="grid grid-cols-[1fr_2fr_100px] gap-4 p-6 bg-stone-900 text-stone-100 text-sm font-black uppercase tracking-widest">
                  <div>Student</div>
                  <div>Progress</div>
                  <div className="text-center">Status</div>
                </div>
                <div className="divide-y-2 divide-stone-100 max-h-[600px] overflow-y-auto">
                  {students.sort((a, b) => b.progress - a.progress).map(student => (
                    <div key={student.id} className="grid grid-cols-[1fr_2fr_100px] gap-4 p-6 items-center hover:bg-stone-50 transition-colors">
                      <div className="font-black text-2xl truncate">{student.nickname}</div>
                      <div className="relative h-10 bg-stone-100 rounded-2xl overflow-hidden border-2 border-stone-800">
                        <div 
                          className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-700 ease-out"
                          style={{ width: `${student.progress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-stone-900 drop-shadow-sm">
                          {student.progress}%
                        </div>
                      </div>
                      <div className="flex justify-center">
                        {student.isFinished ? (
                          <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-stone-200 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

declare global {
  interface Window {
    gameData: any;
  }
}
