export class HttpClientError extends Error {
  response: Response;
  request: string | URL | Request;
  constructor(
    message: string,
    request: string | URL | Request,
    response: Response
  ) {
    super(message);
    this.response = response;
    this.request = request;
  }
}
