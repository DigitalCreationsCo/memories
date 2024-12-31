"use client"

import { ACCESS_TOKEN } from "@/constants/constants";
import { useCustomApiHeaders } from "@/hooks/use-custom-api-headers";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import * as fetchIntercept from "fetch-intercept";
import { useEffect } from "react";
import cookies from "cookies-next";
import { checkDuplicateRequestAndStoreRequest } from "@/controllers/api/helpers/check-duplicate-requests";
import { useLogout } from "@/hooks/auth/use-logout";
import { useRefreshAccessToken } from "@/hooks/auth/use-refresh-access-token";

const api: AxiosInstance = axios.create({
  baseURL: "",
});

function ApiInterceptor() {
  const { mutate: mutationLogout } = useLogout();
  const { mutate: mutationRenewAccessToken } = useRefreshAccessToken();
  const isLoginPage = location.pathname.includes("signin");
  const customHeaders = useCustomApiHeaders();

  useEffect(() => {
    const unregister = fetchIntercept.register({
      request: function (url, config) {
        const accessToken = cookies.getCookie(ACCESS_TOKEN);
        if (accessToken && !isAuthorizedURL(config?.url)) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        for (const [key, value] of Object.entries(customHeaders)) {
          config.headers[key] = value;
        }
        return [url, config];
      },
    });

    const interceptor = api.interceptors.response.use(
      (response) => {
        // setHealthCheckTimeout(null);
        return response;
      },
      async (error: AxiosError) => {
        const isAuthenticationError =
          error?.response?.status === 403 || error?.response?.status === 401;

        if (isAuthenticationError) {
          return Promise.reject(error);
        }

        if (!isAuthenticationError) {
          return Promise.reject(error);
        }
      },
    );

    const isAuthorizedURL = (url: string) => {
      const authorizedDomains = [
        "https://raw.githubusercontent.com/langflow-ai/langflow_examples/main/examples",
        "https://api.github.com/repos/langflow-ai/langflow_examples/contents/examples",
        "https://api.github.com/repos/langflow-ai/langflow",
        "auto_login",
      ];

      const authorizedEndpoints = ["auto_login"];

      try {
        const parsedURL = new URL(url);
        const isDomainAllowed = authorizedDomains.some(
          (domain) => parsedURL.origin === new URL(domain).origin,
        );
        const isEndpointAllowed = authorizedEndpoints.some((endpoint) =>
          parsedURL.pathname.includes(endpoint),
        );

        return isDomainAllowed || isEndpointAllowed;
      } catch (e) {
        // Invalid URL
        return false;
      }
    };

    // Request interceptor to add access token to every request
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const controller = new AbortController();
        try {
          checkDuplicateRequestAndStoreRequest(config);
        } catch (e) {
          const error = e as Error;
          controller.abort(error.message);
          console.error(error.message);
        }

        const accessToken = cookies;
        if (accessToken && !isAuthorizedURL(config!.url!)) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const currentOrigin = window.location.origin;
        const requestUrl = new URL(config?.url as string, currentOrigin);

        const urlIsFromCurrentOrigin = requestUrl.origin === currentOrigin;
        if (urlIsFromCurrentOrigin) {
          console.log("urlIsFromCurrentOrigin", urlIsFromCurrentOrigin);
          for (const [key, value] of Object.entries(customHeaders)) {
            config.headers[key] = value;
          }
        }

        return {
          ...config,
          signal: controller.signal,
        };
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return () => {
      // Clean up the interceptors when the component unmounts
      api.interceptors.response.eject(interceptor);
      api.interceptors.request.eject(requestInterceptor);
      unregister();
    };
  }, [customHeaders]);

  async function tryToRenewAccessToken(error: AxiosError) {
    if (isLoginPage) return;
    if (error.config?.headers) {
      for (const [key, value] of Object.entries(customHeaders)) {
        error.config.headers[key] = value;
      }
    }
    mutationRenewAccessToken(undefined, {
      onSuccess: async () => {
        await remakeRequest(error);
      },
      onError: (error) => {
        console.error(error);
        mutationLogout();
        return Promise.reject("Authentication error");
      },
    });
  }

  async function remakeRequest(error: AxiosError) {
    const originalRequest = error.config as AxiosRequestConfig;

    try {
      const accessToken = cookies.getCookie(ACCESS_TOKEN);
      if (!accessToken) {
        throw new Error("Access token not found in cookies");
      }

      // Modify headers in originalRequest
      originalRequest.headers = {
        ...(originalRequest.headers as Record<string, string>), // Cast to suppress TypeScript error
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.request(originalRequest);
      return response.data; // Or handle the response as needed
    } catch (err) {
      throw err; // Throw the error if request fails again
    }
  }

  return null;
}

export type StreamingRequestParams = {
  method: string;
  url: string;
  onData: (event: object) => Promise<boolean>;
  body?: object;
  onError?: (statusCode: number) => void;
  onNetworkError?: (error: Error) => void;
};

async function performStreamingRequest({
  method,
  url,
  onData,
  body,
  onError,
  onNetworkError,
}: StreamingRequestParams) {
  let headers = {
    "Content-Type": "application/json",
    // this flag is fundamental to ensure server stops tasks when client disconnects
    Connection: "close",
  };
  const controller = new AbortController();
  const params = {
    method: method,
    headers: headers,
    signal: controller.signal,
  } as any;
  if (body) {
    params["body"] = JSON.stringify(body);
  }
  let current: string[] = [];
  let textDecoder = new TextDecoder();

  try {
    const response = await fetch(url, params);
    if (!response.ok) {
      if (onError) {
        onError(response.status);
      } else {
        throw new Error("Error in streaming request.");
      }
    }
    if (response.body === null) {
      return;
    }
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = textDecoder.decode(value);
      let all = decodedChunk.split("\n\n");
      for (const string of all) {
        if (string.endsWith("}")) {
          const allString = current.join("") + string;
          let data: object;
          try {
            data = JSON.parse(allString);
            current = [];
          } catch (e) {
            current.push(string);
            continue;
          }
          const shouldContinue = await onData(data);
          if (!shouldContinue) {
            controller.abort();
            return;
          }
        } else {
          current.push(string);
        }
      }
    }
    if (current.length > 0) {
      const allString = current.join("");
      if (allString) {
        const data = JSON.parse(current.join(""));
        await onData(data);
      }
    }
  } catch (e: any) {
    if (onNetworkError) {
      onNetworkError(e);
    } else {
      throw e;
    }
  }
}

export { api, ApiInterceptor, performStreamingRequest };