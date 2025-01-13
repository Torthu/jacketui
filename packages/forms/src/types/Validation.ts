export interface Validation {
  message: string;
  description: string;
  source: "client" | "server";
  severity: "info" | "warning" | "error";
}
