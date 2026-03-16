/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Lobby from './components/Lobby';
import TeacherDashboard from './components/TeacherDashboard';
import StudentClient from './components/StudentClient';

type View = 'lobby' | 'teacher' | 'student';

export default function App() {
  const [view, setView] = useState<View>('lobby');
  const [hostId, setHostId] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  const [teacherMode, setTeacherMode] = useState<'online' | 'print' | null>(null);

  const handleJoin = (role: 'teacher' | 'student', data: { hostId?: string; nickname?: string; mode?: 'online' | 'print' }) => {
    if (role === 'teacher') {
      setTeacherMode(data.mode || null);
      setView('teacher');
    } else {
      setHostId(data.hostId || '');
      setNickname(data.nickname || '');
      setView('student');
    }
  };

  return (
    <div className="antialiased text-stone-900">
      {view === 'lobby' && <Lobby onJoin={handleJoin} />}
      {view === 'teacher' && <TeacherDashboard initialMode={teacherMode} />}
      {view === 'student' && <StudentClient hostId={hostId} nickname={nickname} />}
    </div>
  );
}

