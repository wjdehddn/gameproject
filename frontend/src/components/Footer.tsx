const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-sm py-6 shadow-inner">
      <div className="max-w-6xl mx-auto text-center space-y-2 px-4">
        <p>
          놀이터는 개발 역량 강화를 위해 제작된 개인 프로젝트입니다.  
          React, TypeScript, Vite, TailwindCSS, Node.js 기반으로 구축되었습니다.
        </p>
        <p>
          Designed & Developed by <a href="https://github.com/wjdehddn" className="underline hover:text-blue-600">wjdehddn</a>
        </p>
        <p className="text-xs text-gray-500">
          © 2025 놀이터 | 포트폴리오용 비상업적 프로젝트입니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;