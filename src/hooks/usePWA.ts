
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  installApp: () => Promise<void>;
}

export const usePWA = (): PWAState => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true ||
                        window.location.search.includes('standalone=true');
      setIsStandalone(standalone);
      console.log('Standalone mode:', standalone);
    };

    // Check if app is already installed - only in secure context and top-level
    const checkInstalled = () => {
      try {
        if ('getInstalledRelatedApps' in navigator && 
            window.location.protocol === 'https:' && 
            window === window.top) {
          (navigator as any).getInstalledRelatedApps().then((relatedApps: any[]) => {
            const installed = relatedApps.length > 0;
            setIsInstalled(installed);
            console.log('App installed:', installed);
          }).catch(() => {
            // Silently fail if not supported
            setIsInstalled(false);
          });
        }
      } catch (error) {
        // Silently fail if not supported
        setIsInstalled(false);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      console.log('PWA install prompt available');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    };

    checkStandalone();
    checkInstalled();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Debug PWA criteria
    console.log('PWA Debug Info:', {
      isSecureContext: window.isSecureContext,
      hasServiceWorker: 'serviceWorker' in navigator,
      protocol: window.location.protocol,
      manifest: document.querySelector('link[rel="manifest"]')?.getAttribute('href')
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
    
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return {
    isInstalled,
    isStandalone,
    canInstall,
    deferredPrompt,
    installApp
  };
};
