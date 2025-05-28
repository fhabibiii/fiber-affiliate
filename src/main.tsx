
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'

const AppWithSplash = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <App />;
};

createRoot(document.getElementById("root")!).render(<AppWithSplash />);
