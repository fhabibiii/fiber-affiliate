
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center animate-gradient-slow dark:animate-gradient-slow-dark">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <h1 className="text-6xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Oops! Halaman tidak ditemukan</p>
        <a 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default NotFound;
