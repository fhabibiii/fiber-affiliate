
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Info } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { canInstall, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [showManualInstructions, setShowManualInstructions] = React.useState(false);

  React.useEffect(() => {
    if (canInstall) {
      // Show prompt after a delay to not interrupt user experience
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // If browser doesn't support install prompt, show manual instructions after some time
      const timer = setTimeout(() => {
        // Only show if not dismissed and not in standalone mode
        if (!sessionStorage.getItem('pwa-install-dismissed') && 
            !window.matchMedia('(display-mode: standalone)').matches) {
          setShowManualInstructions(true);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  const handleInstallClick = async () => {
    try {
      await installApp();
      setShowPrompt(false);
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManualInstructions(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if dismissed in this session
  if (sessionStorage.getItem('pwa-install-dismissed') === 'true') {
    return null;
  }

  // Show automatic install prompt if available
  if (showPrompt && canInstall) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Install Fibernode Internet
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Install aplikasi untuk akses yang lebih cepat dan mudah
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1"
            >
              Nanti
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show manual instructions if automatic install not available
  if (showManualInstructions && !canInstall) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Info className="w-4 h-4 text-blue-600 mr-2" />
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Install Aplikasi
                </h3>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                Untuk install sebagai aplikasi:
                <br />• Chrome: Menu → "Install app" atau "Add to Home screen"
                <br />• Safari: Share → "Add to Home Screen"
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto text-blue-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Mengerti
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
