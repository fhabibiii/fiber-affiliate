
import { env } from '@/config/environment';

class Logger {
  private prefix = '[Fibernode Internet]';

  log(...args: any[]) {
    if (env.IS_DEVELOPMENT) {
      console.log(this.prefix, ...args);
    }
  }

  error(...args: any[]) {
    if (env.IS_DEVELOPMENT) {
      console.error(this.prefix, ...args);
    }
  }

  warn(...args: any[]) {
    if (env.IS_DEVELOPMENT) {
      console.warn(this.prefix, ...args);
    }
  }

  info(...args: any[]) {
    if (env.IS_DEVELOPMENT) {
      console.info(this.prefix, ...args);
    }
  }

  debug(...args: any[]) {
    if (env.IS_DEVELOPMENT) {
      console.debug(this.prefix, ...args);
    }
  }
}

export const logger = new Logger();
