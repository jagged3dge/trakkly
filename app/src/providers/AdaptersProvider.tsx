import React, { createContext, useContext, useMemo } from 'react';
import { loadEnv, type EnvConfig } from '../config/env';
import { NoopTelemetryAdapter, type TelemetryAdapter } from '../adapters/telemetry';
import { LocalOnlySyncAdapter, type SyncAdapter } from '../adapters/sync';
import { PlaceholderCryptoEngine, type CryptoEngine } from '../adapters/crypto';
import { NoopDeviceUnlockAdapter, type DeviceUnlockAdapter } from '../adapters/deviceUnlock';

export type Adapters = {
  env: EnvConfig;
  telemetry: TelemetryAdapter;
  sync: SyncAdapter;
  crypto: CryptoEngine;
  deviceUnlock: DeviceUnlockAdapter;
};

const AdaptersContext = createContext<Adapters | null>(null);

export function AdaptersProvider({ children }: { children: React.ReactNode }) {
  const env = useMemo(() => loadEnv(), []);

  const telemetry = useMemo(() => {
    const t = new NoopTelemetryAdapter();
    t.setEnabled(!!env.telemetry.enabled);
    return t;
  }, [env]);

  const sync = useMemo(() => {
    const s = new LocalOnlySyncAdapter();
    s.setEnabled(false);
    return s;
  }, []);

  const crypto = useMemo(() => new PlaceholderCryptoEngine(), []);
  const deviceUnlock = useMemo(() => new NoopDeviceUnlockAdapter(), []);

  const value: Adapters = { env, telemetry, sync, crypto, deviceUnlock };

  return (
    <AdaptersContext.Provider value={value}>{children}</AdaptersContext.Provider>
  );
}

export function useAdapters(): Adapters {
  const ctx = useContext(AdaptersContext);
  if (!ctx) throw new Error('useAdapters must be used within AdaptersProvider');
  return ctx;
}
