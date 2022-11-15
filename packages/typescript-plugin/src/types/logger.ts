export type Logger = {
  log: (message: string) => void;
  error: (error: Error) => void;
}