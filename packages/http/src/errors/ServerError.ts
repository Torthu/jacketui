export class ServerError extends Error {
  status: number;

  response: Response;
  request: string | URL | Request;

  constructor(
    message: string,
    request: string | URL | Request,
    response: Response
  ) {
    super(message);
    this.status = response.status;
    this.response = response;
    this.request = request;
  }
}
