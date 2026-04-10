import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bubbry.customer',
  appName: 'BubbryCustomer',
  webDir: 'out',
  android: {
    backgroundColor: '#0D1B3E',
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
