import React, { useState } from 'react';
import { LogIn, School, User, Play, Printer } from 'lucide-react';
import Footer from './Footer';

interface LobbyProps {
  onJoin: (role: 'teacher' | 'student', data: { hostId?: string; nickname?: string; mode?: 'online' | 'print' }) => void;
}

export default function Lobby({ onJoin }: LobbyProps) {
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [hostId, setHostId] = useState('');
  const [nickname, setNickname] = useState('');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tighter text-stone-900 uppercase leading-none">
              Hidden Picture<br/>
              <span className="text-emerald-600">O/X Pixel Art</span>
            </h1>
            <p className="text-stone-500 font-mono mt-4 italic text-sm">
              Interactive Classroom Quiz Game v1.1
            </p>
          </div>

          {!role ? (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setRole('teacher')}
                className="group bg-white border-2 border-stone-800 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all flex items-center gap-6"
              >
                <div className="bg-stone-900 p-4 rounded-xl text-stone-100 group-hover:bg-emerald-500 transition-colors">
                  <School size={32} />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-stone-900">교사로 시작하기</div>
                  <div className="text-sm text-stone-500">방을 만들고 문제를 업로드합니다.</div>
                </div>
              </button>

              <button 
                onClick={() => setRole('student')}
                className="group bg-white border-2 border-stone-800 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all flex items-center gap-6"
              >
                <div className="bg-stone-900 p-4 rounded-xl text-stone-100 group-hover:bg-blue-500 transition-colors">
                  <User size={32} />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-stone-900">학생으로 참여하기</div>
                  <div className="text-sm text-stone-500">코드를 입력하고 퀴즈를 풉니다.</div>
                </div>
              </button>
            </div>
          ) : role === 'teacher' ? (
            <div className="bg-white border-2 border-stone-800 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h2 className="text-2xl font-bold mb-6">교사 모드 선택</h2>
              <p className="text-stone-600 mb-8 text-sm">진행하실 모드를 선택해주세요.</p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <button 
                  onClick={() => onJoin('teacher', { mode: 'online' })}
                  className="group flex items-center gap-4 p-4 border-2 border-stone-800 rounded-xl hover:bg-stone-900 hover:text-white transition-all"
                >
                  <div className="bg-stone-100 p-2 rounded-lg group-hover:bg-stone-800">
                    <Play size={20} className="text-stone-900 group-hover:text-stone-100" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">온라인 실시간 퀴즈</div>
                    <div className="text-xs opacity-70">학생들이 기기로 접속하여 실시간 참여</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => onJoin('teacher', { mode: 'print' })}
                  className="group flex items-center gap-4 p-4 border-2 border-stone-800 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <div className="bg-stone-100 p-2 rounded-lg group-hover:bg-emerald-600">
                    <Printer size={20} className="text-stone-900 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">학습지 출력 모드</div>
                    <div className="text-xs opacity-70">종이 학습지로 출력하여 오프라인 진행</div>
                  </div>
                </button>
              </div>
              <button 
                onClick={() => setRole(null)}
                className="w-full py-3 border-2 border-stone-200 rounded-xl font-bold hover:bg-stone-50 text-stone-400 text-sm"
              >
                뒤로가기
              </button>
            </div>
          ) : (
            <div className="bg-white border-2 border-stone-800 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h2 className="text-2xl font-bold mb-6">학생 참여</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Room Code</label>
                  <input 
                    type="text" 
                    value={hostId}
                    onChange={(e) => setHostId(e.target.value)}
                    placeholder="입장 코드를 입력하세요"
                    className="w-full p-3 border-2 border-stone-200 rounded-xl focus:border-stone-800 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Nickname</label>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    className="w-full p-3 border-2 border-stone-200 rounded-xl focus:border-stone-800 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setRole(null)}
                  className="flex-1 py-3 border-2 border-stone-800 rounded-xl font-bold hover:bg-stone-50"
                >
                  뒤로가기
                </button>
                <button 
                  onClick={() => onJoin('student', { hostId, nickname })}
                  disabled={!hostId || !nickname}
                  className="flex-1 py-3 bg-stone-900 text-stone-100 rounded-xl font-bold hover:bg-stone-700 disabled:opacity-50"
                >
                  참여하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
