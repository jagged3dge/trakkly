import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { loadEnv, type EnvConfig } from '../config/env';
import { NoopTelemetryAdapter, type TelemetryAdapter } from '../adapters/telemetry';
import { LocalOnlySyncAdapter, type SyncAdapter } from '../adapters/sync';
import { PlaceholderCryptoEngine, WebCryptoEngine, type CryptoEngine } from '../adapters/crypto';
import { NoopDeviceUnlockAdapter, type DeviceUnlockAdapter } from '../adapters/deviceUnlock';
import { WebAuthnDeviceUnlockAdapter } from '../adapters/deviceUnlock/webauthn';
import { usePrefs } from '../state/prefs';

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
  const { prefs, loaded, load } = usePrefs();

  const telemetry = useMemo(() => {
    const t = new NoopTelemetryAdapter();
    // initial enable follows env; will be updated once prefs load
    t.setEnabled(!!env.telemetry.enabled);
    return t;
  }, [env]);

  const sync = useMemo(() => {
    const s = new LocalOnlySyncAdapter();
    s.setEnabled(false);
    return s;
  }, []);

  // Use WebCrypto engine in browsers and tests; fall back to placeholder if subtle is unavailable
  const crypto = useMemo<CryptoEngine>(() => {
    const hasSubtle = typeof globalThis !== 'undefined' && !!(globalThis.crypto as any)?.subtle
    return hasSubtle ? new WebCryptoEngine() : new PlaceholderCryptoEngine()
  }, []);
  const deviceUnlock = useMemo<DeviceUnlockAdapter>(() => {
    const hasWebAuthn = typeof window !== 'undefined' && 'PublicKeyCredential' in window && 'credentials' in navigator
    return hasWebAuthn ? new WebAuthnDeviceUnlockAdapter() : new NoopDeviceUnlockAdapter()
  }, []);

  const value: Adapters = { env, telemetry, sync, crypto, deviceUnlock };

  // Load preferences on app start to apply telemetry preference
  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);

  // Apply telemetryEnabled preference whenever it changes
  useEffect(() => {
    const shouldEnable = !!env.telemetry.enabled && !!prefs.telemetryEnabled;
    telemetry.setEnabled(shouldEnable);
  }, [env.telemetry.enabled, prefs.telemetryEnabled, telemetry]);

  return (
    <AdaptersContext.Provider value={value}>{children}</AdaptersContext.Provider>
  );
}

export function useAdapters(): Adapters {
  const ctx = useContext(AdaptersContext);
  if (!ctx) throw new Error('useAdapters must be used within AdaptersProvider');
  return ctx;
}
