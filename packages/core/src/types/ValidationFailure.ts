export interface ValidationFailure {
  ok: false;
  message: string;
  description: string;
  source: "client" | "server";
  severity: "info" | "warning" | "error";
}
