import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-stone-200 bg-stone-50 print:hidden">
      <div className="max-w-7xl mx-auto px-6 text-center text-stone-500 text-sm">
        <p className="mb-2">
          만든 사람: <span className="font-bold text-stone-700">경기도 지구과학 교사 뀨짱</span>
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <a 
            href="https://open.kakao.com/o/s7hVU65h" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-stone-800 underline underline-offset-4 transition-colors"
          >
            문의: 카카오톡 오픈채팅
          </a>
          <a 
            href="https://eduarchive.tistory.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-stone-800 underline underline-offset-4 transition-colors"
          >
            블로그: 뀨짱쌤의 교육자료 아카이브
          </a>
        </div>
      </div>
    </footer>
  );
}
