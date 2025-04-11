export interface JuiErrorOptions {
  type?: string;
  cause?: Error;
  context?: Record<string, any>;
  tag?: string;
}

/** JuiError: JacketUI Error
 *
 * JuiError extends the built in Error class with "type": "ERROR", "context" and "tag".
 *
 * @property type "ERROR" makes these errors valid actions.
 * @property context "JSONable" object with error information.
 * @property tag "string" with error type e.g "TypeError", "ValidationError"
 *
 *  @param message - The error message
 *  @param options - The error options
 *  @param options.cause - The cause of the error
 *  @param options.context - The context of the error
 *  @param options.tag - The tag of the error (default: "JuiError") e.g "TypeError", "ValidationError"
 */
export class JuiError extends Error {
  public type: JuiErrorOptions["type"];

  public readonly context?: JuiErrorOptions["context"];
  public readonly tag: JuiErrorOptions["tag"];

  constructor(
    message: string,
    { cause, context, tag = "JuiError", type = "ERROR" }: JuiErrorOptions = {}
  ) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.context = context;

    this.tag = tag;
    this.type = type;
  }
}
