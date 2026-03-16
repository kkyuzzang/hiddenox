import { Quiz } from '../types';

export const mapDesignToQuizzes = (designGrid: number[][], quizzes: Quiz[]): number[][] => {
  const oQuizzes = quizzes.filter(q => q.answer === 'O').map(q => q.id);
  const xQuizzes = quizzes.filter(q => q.answer === 'X').map(q => q.id);

  if (oQuizzes.length === 0 || xQuizzes.length === 0) {
    // Fallback if no O or X quizzes
    return designGrid.map(row => row.map(cell => cell === 1 ? (oQuizzes[0] || 1) : (xQuizzes[0] || 2)));
  }

  return designGrid.map(row => 
    row.map(cell => {
      if (cell === 1) {
        // Map to a random 'O' quiz ID
        return oQuizzes[Math.floor(Math.random() * oQuizzes.length)];
      } else {
        // Map to a random 'X' quiz ID
        return xQuizzes[Math.floor(Math.random() * xQuizzes.length)];
      }
    })
  );
};
