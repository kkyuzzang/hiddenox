import * as XLSX from 'xlsx';

export const downloadSampleExcel = () => {
  // Sample Quiz Data
  const quizData = [
    { '번호': 1, '문제내용': '대한민국의 수도는 서울이다.', '정답': 'O' },
    { '번호': 2, '문제내용': '고양이는 멍멍하고 짖는다.', '정답': 'X' },
    { '번호': 3, '문제내용': '1+1은 2이다.', '정답': 'O' },
    { '번호': 4, '문제내용': '지구는 평평하다.', '정답': 'X' },
    { '번호': 5, '문제내용': '사과는 과일이다.', '정답': 'O' },
  ];

  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create Quiz Sheet
  const wsQuiz = XLSX.utils.json_to_sheet(quizData);
  XLSX.utils.book_append_sheet(wb, wsQuiz, '퀴즈목록');

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, '퀴즈_양식_샘플.xlsx');
};
