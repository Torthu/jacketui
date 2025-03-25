export class CorsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CorsError";
  }
}
