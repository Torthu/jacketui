import { md5 } from "../../Crypto";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type Priority = "urgent" | "normal" | "idle";
export type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text";

interface HttpClientConstructor {
  XHR?: XMLHttpRequest;
}

export interface HttpClientRequest {
  url: string;
  method: HttpMethod;
  headers: object;
  body?: string | object;
  withCredentials?: boolean;
  priority: Priority;
  timeout?: number;
  user?: string;
  password?: string;
  async?: boolean;
  responseType?: ResponseType;
}

export interface HttpClientResponse {
  body: string;
  headers: object;
  status: number;
  request: HttpClientRequest;
  retry: () => void;
}

export type HttpClientAbort = () => void;

interface ActiveRequest {
  hash: string;
  xhr: XMLHttpRequest;
  onSuccess: () => void;
  onError: (err) => void;
  onTimeout: () => void;
  onAbort: () => void;
  abort: () => void;
  requests: HttpClientRequest[];
  callbacks: HttpClientCallback[];
}

export type HttpClientCallback = (res: HttpClientResponse) => any;

export default class HttpClient {
  public XHR = XMLHttpRequest;

  /**
   * Send a request
   * @param request [HttpClientRequest]
   * @param callback [HttpClientCallback]
   * @return [Function] abort - a method you can use to abort the request
   */
  public send(
    request: HttpClientRequest,
    callback: HttpClientCallback
  ): HttpClientAbort {
    const hash: string = this.createRequestHash(request);
    let activeRequest = this.findActiveRequest(hash);

    if (activeRequest !== undefined) {
      activeRequest.requests.push(request);
      activeRequest.callbacks.push(callback);
    } else {
      const xhr = this.createXHR(request);
      const newRequest = this.createActiveRequest(request, xhr, hash, callback);
      activeRequest = newRequest;

      this.activeRequests.push(newRequest);

      const sendXhr = () => {
        if (newRequest.requests.length > 0) {
          xhr.send();
        }
      };

      sendXhr();
    }

    return () => {
      const index = activeRequest.requests.indexOf(request);
      if (index > -1) {
        activeRequest.requests.splice(index, 1);
        activeRequest.callbacks.splice(index, 1);

        if (activeRequest.requests.length === 0) {
          const activeRequestIndex = this.activeRequests.indexOf(activeRequest);

          if (activeRequestIndex > -1) {
            this.activeRequests.splice(activeRequestIndex, 1);
          }

          if (activeRequest.xhr.readyState > 1) {
            activeRequest.xhr.abort();
          }
        }
      }
    };
  }

  private createXHR(request: HttpClientRequest) {
    const xhr = new this.XHR();

    if (typeof request.async === "undefined") {
      request.async = true;
    }

    if (typeof request.withCredentials !== "boolean") {
      request.withCredentials = false;
    }

    if (request.method === "GET" && typeof request.body === "object") {
      request.url += "?" + this.encodeFormData(request.body);
    }

    xhr.open(
      request.method,
      request.url,
      request.async,
      request.user,
      request.password
    );

    xhr.timeout = request.timeout || 2000;

    for (const key in request.headers) {
      if (request.headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, request.headers[key]);
      }
    }

    xhr.withCredentials = request.withCredentials;

    return xhr;
  }

  private encodeFormData(body: object): string {
    const encodedParameters: string = Object.keys(body)
      .map((key) => [key, body[key]].map(encodeURIComponent).join("="))
      .join("&");
    return encodedParameters;
  }

  private createActiveRequest(
    request: HttpClientRequest,
    xhr: XMLHttpRequest,
    hash: string,
    callback: HttpClientCallback
  ): ActiveRequest {
    const activeRequest: ActiveRequest = {
      xhr,
      onSuccess: () => {
        this.onSuccess(activeRequest);
      },
      onTimeout: () => {
        this.onTimeout(activeRequest);
      },
      onError: () => {
        this.onError(activeRequest);
      },
      onAbort: (): any => {
        this.onAbort(activeRequest);
      },
      abort: () => {
        xhr.abort();
      },
      hash,
      requests: [request],
      callbacks: [callback],
    };

    // bind to XHR
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        activeRequest.onSuccess();
      }
    };

    xhr.ontimeout = () => activeRequest.onTimeout();
    xhr.onabort = () => activeRequest.onAbort();
    xhr.onerror = (ev) => {
      activeRequest.onError(ev);
    };

    return activeRequest;
  }

  private onSuccess(activeRequest: ActiveRequest): void {
    const { xhr } = activeRequest;
    const body = xhr.responseText;
    const status = xhr.status;
    const headersArr = xhr
      .getAllResponseHeaders()
      .trim()
      .split(/[\r\n]+/);
    const headers = {};

    this.activeRequests.splice(this.activeRequests.indexOf(activeRequest, 1));

    headersArr.forEach((value) => {
      const split = value.split(": ");
      headers[split[0]] = split[1];
    });

    activeRequest.requests.forEach((request, index) => {
      const callback = activeRequest.callbacks[index];
      const response: HttpClientResponse = {
        body,
        headers,
        status,
        request,
        retry: () => {
          this.send(request, callback);
        },
      };

      callback(response);
    });

    return;
  }

  // TODO: implement
  private onError(activeRequest: ActiveRequest): void {
    this.logger?.warning("HttpClient.onError not implemented");
  }

  // TODO: implement
  private onAbort(activeRequest: ActiveRequest): void {
    this.logger?.warning("HttpClient.onAbort not implemented");
  }

  // TODO: implement
  private onTimeout(activeRequest: ActiveRequest): void {
    this.logger?.warning("HttpClient.onTimeout not implemented");
  }

  private activeRequests: ActiveRequest[] = [];

  private findActiveRequest(requestHash: string): ActiveRequest | undefined {
    for (const activeRequest of this.activeRequests) {
      if (activeRequest.hash === requestHash) {
        return activeRequest;
      }
    }
    return undefined;
  }

  private createRequestHash(request: HttpClientRequest): string {
    return md5(request);
  }
}
