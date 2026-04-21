type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Vite expõe variáveis em import.meta.env
const isProd = import.meta.env.PROD;

function shouldLog(level: LogLevel) {
  if (!isProd) return true;
  // Em produção: não logar nada de info/debug.
  return level === 'warn' || level === 'error';
}

function format(prefix: string, args: unknown[]) {
  if (args.length === 0) return prefix;
  return [prefix, ...args] as unknown[];
}

export const logger = {
  debug: (message?: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.debug(...(format('[debug]', [message, ...optionalParams]) as any));
  },
  info: (message?: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog('info')) return;
    // eslint-disable-next-line no-console
    console.info(...(format('[info]', [message, ...optionalParams]) as any));
  },
  warn: (message?: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog('warn')) return;
    // eslint-disable-next-line no-console
    console.warn(...(format('[warn]', [message, ...optionalParams]) as any));
  },
  error: (message?: unknown, ...optionalParams: unknown[]) => {
    // errors sempre logam (inclusive em prod)
    // eslint-disable-next-line no-console
    console.error(...(format('[error]', [message, ...optionalParams]) as any));
  },
};
