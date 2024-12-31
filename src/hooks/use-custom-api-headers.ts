export function useCustomApiHeaders() {
    const customHeaders = {
      "x-api-key": process.env.API_KEY,
    };
    console.debug("customHeaders", customHeaders);
    return customHeaders;
  }