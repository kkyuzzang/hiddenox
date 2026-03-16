export interface Quiz {
  id: number;
  question: string;
  answer: 'O' | 'X';
}

export interface GameData {
  quizzes: Quiz[];
  grid: number[][]; // 2D array of numbers mapping to quiz IDs
}

export interface StudentProgress {
  id: string;
  nickname: string;
  progress: number; // 0 to 100
  isFinished: boolean;
  coloredCells: Set<string>; // "row-col" format
}

export type PeerMessage = 
  | { type: 'GAME_DATA'; data: GameData }
  | { type: 'PROGRESS_UPDATE'; nickname: string; progress: number; isFinished: boolean };
