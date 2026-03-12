export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function createLogger(debugEnabled: boolean): Logger {
  return {
    debug(message) {
      if (debugEnabled) {
        console.error(`[debug] ${message}`);
      }
    },
    info(message) {
      console.error(message);
    },
    warn(message) {
      console.error(`warning: ${message}`);
    },
    error(message) {
      console.error(`error: ${message}`);
    }
  };
}
