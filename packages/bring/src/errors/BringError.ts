import { BringInit } from "../types/BringInit";
import { JuiError, JuiErrorOptions } from "@torthu/jacketui-core";

export interface BringErrorOptions extends JuiErrorOptions {
  response?: Response;
  request?: Request;
  requestInit: BringInit;
  url: string | URL;
}

export class BringError extends JuiError {
  public readonly response?: BringErrorOptions["response"];
  public readonly request?: BringErrorOptions["request"];
  public readonly requestInit: BringErrorOptions["requestInit"];
  public readonly url: BringErrorOptions["url"];

  constructor(message: string, options: BringErrorOptions) {
    super(message, options);
    this.response = options.response;
    this.request = options.request;
    this.requestInit = options.requestInit;
    this.url = options.url;
  }
}
