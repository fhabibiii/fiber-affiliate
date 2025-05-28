
import React from 'react';
import { Zap } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-blue-600 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
          <Zap className="text-blue-600 w-12 h-12" />
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Fibernode Internet</h1>
        <p className="text-blue-100 text-sm">Memuat aplikasi...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
