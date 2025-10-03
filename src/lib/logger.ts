// Production-ready logging utility
export class Logger {
  private static isProduction = process.env.NODE_ENV === 'production';

  static info(message: string, data?: unknown) {
    if (!this.isProduction) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  static error(message: string, error?: unknown) {
    if (!this.isProduction) {
      console.error(`[ERROR] ${message}`, error || '');
    }
    // In production, you might want to send to a logging service
    // like Sentry, LogRocket, etc.
  }

  static warn(message: string, data?: unknown) {
    if (!this.isProduction) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  static debug(message: string, data?: unknown) {
    if (!this.isProduction) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}
