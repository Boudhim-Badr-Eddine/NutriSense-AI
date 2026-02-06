type LogLevel = "info" | "warn" | "error" | "debug";

type LogColor = {
  label: string;
  color: string;
};

const colors: Record<LogLevel, LogColor> = {
  info: { label: "INFO", color: "\u001b[34m" },
  warn: { label: "WARN", color: "\u001b[33m" },
  error: { label: "ERROR", color: "\u001b[31m" },
  debug: { label: "DEBUG", color: "\u001b[35m" },
};

const resetColor = "\u001b[0m";

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  const color = colors[level];
  return `${color.color}[${color.label}]${resetColor} ${timestamp} - ${message}`;
};

const log = (level: LogLevel, message: string, meta?: unknown): void => {
  const formatted = formatMessage(level, message);
  if (meta) {
    console.log(formatted, meta);
    return;
  }
  console.log(formatted);
};

/**
 * WHY: Centralize logging for consistent output across the backend.
 */
export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
};
