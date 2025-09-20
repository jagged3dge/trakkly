export type EnvConfig = {
  envName: 'dev' | 'staging' | 'prod';
  telemetry: {
    sentryDsn?: string;
    posthogKey?: string;
    posthogHost?: string;
    enabled: boolean; // global user setting (opt-in). Default false.
  };
};

export function loadEnv(): EnvConfig {
  const env = import.meta.env || ({} as any);
  const envName = (env.VITE_ENV_NAME as EnvConfig['envName']) || 'dev';
  const sentryDsn = (env.VITE_SENTRY_DSN as string | undefined) || undefined;
  const posthogKey = (env.VITE_POSTHOG_KEY as string | undefined) || undefined;
  const posthogHost = (env.VITE_POSTHOG_HOST as string | undefined) || 'https://app.posthog.com';

  return {
    envName,
    telemetry: {
      sentryDsn,
      posthogKey,
      posthogHost,
      enabled: false,
    },
  };
}
