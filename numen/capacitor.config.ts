import type { CapacitorConfig } from '@capacitor/cli';

/**
 * NUMENEON Capacitor Configuration
 * Integrates with existing PWA manifest for native app capabilities
 */
const config: CapacitorConfig = {
  appId: 'com.numeneon.app',
  appName: 'NUMENEON',
  webDir: 'dist',
  
  // Server config for development
  server: {
    // For local dev, uncomment and set to your machine's IP:
    // url: 'http://192.168.1.x:5173',
    // cleartext: true,
    androidScheme: 'https',
    iosScheme: 'https',
  },

  // Plugin configurations
  plugins: {
    // Push Notifications
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // Camera for profile pictures and story media
    Camera: {
      // Use photo library and camera
    },

    // Local storage persistence
    Preferences: {
      // Uses @capacitor/preferences for key-value storage
    },

    // Splash screen matching NUMENEON theme
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#4fffff',
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Status bar styling
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0f',
    },

    // Keyboard behavior
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },

  // iOS-specific configuration
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'NUMENEON',
  },

  // Android-specific configuration
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set true for debug builds
  },
};

export default config;
