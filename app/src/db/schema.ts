// Domain types for Trakkly
export type ID = string;

export type Tracker = {
  id: ID;
  name: string;
  color: string; // hex or token
  icon: string; // icon name
  tags: string[];
  stepSize: number; // integer
  pinned: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

export type EventType = 'increment' | 'adjustment';

export type Event = {
  id: ID;
  trackerId: ID;
  type: EventType;
  value: number; // positive for increment; adjustment may be +/-
  reason?: string;
  createdAt: string; // ISO timestamp (device time)
  deviceId: string;
};

export type ClockFormat = '12' | '24';

export type AccessibilityPrefs = {
  reducedMotion?: boolean;
  highContrast?: boolean;
};

export type UserPreferences = {
  id: ID;
  timezone?: string;
  locale?: string;
  clockFormat: ClockFormat;
  a11yPrefs?: AccessibilityPrefs;
  telemetryEnabled?: boolean;
  deviceUnlockEnabled?: boolean;
  deviceCredentialId?: string; // base64url rawId
  // Key management (MVP: PBKDF2-derived KEK + wrapped data key)
  keySalt?: string; // base64
  wrappedKey?: string; // base64(iv || ciphertext)
  kdf?: 'pbkdf2';
  kdfParams?: { iterations: number };
};
