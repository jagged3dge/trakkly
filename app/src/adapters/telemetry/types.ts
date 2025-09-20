export type TelemetryEvent = {
  name: string;
  properties?: Record<string, any>;
};

export interface TelemetryAdapter {
  init(): Promise<void> | void;
  setEnabled(enabled: boolean): void;
  identify(userId?: string, traits?: Record<string, any>): void;
  capture(event: TelemetryEvent): void;
  flush?(): Promise<void>;
  shutdown?(): Promise<void>;
}
