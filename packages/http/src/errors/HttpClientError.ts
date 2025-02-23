export class HttpClientError extends Error {
  response: number;
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}
