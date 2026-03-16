import * as XLSX from 'xlsx';
import { GameData, Quiz } from '../types';

export const parseExcel = async (file: File): Promise<GameData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Sheet 1: Quizzes
        const quizSheet = workbook.Sheets[workbook.SheetNames[0]];
        const quizRows = XLSX.utils.sheet_to_json<any>(quizSheet);
        const quizzes: Quiz[] = quizRows.map((row: any) => ({
          id: parseInt(row['번호'] || row['id']),
          question: row['문제내용'] || row['question'],
          answer: (row['정답'] || row['answer']).toString().toUpperCase() as 'O' | 'X'
        }));

        // Sheet 2: Grid
        const gridSheet = workbook.Sheets[workbook.SheetNames[1]];
        const gridData = XLSX.utils.sheet_to_json<any>(gridSheet, { header: 1 });
        const grid: number[][] = gridData.map((row: any[]) => 
          row.map(cell => (cell === null || cell === undefined ? 0 : parseInt(cell)))
        );

        resolve({ quizzes, grid });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
