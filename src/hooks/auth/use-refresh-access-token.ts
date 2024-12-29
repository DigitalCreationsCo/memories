import { REFRESH_TOKEN } from "@/constants/constants";
import { useMutationFunctionType } from "@/types/api";
import cookies from "cookies-next";
import { api } from "@/controllers/api/api";
import { getURL } from "@/utils/url.utils";
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
interface IRefreshAccessToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const useRefreshAccessToken: useMutationFunctionType<
  undefined,
  undefined | void,
  IRefreshAccessToken
> = (options?) => {
  const { mutate } = UseRequestProcessor();

  async function refreshAccess(): Promise<IRefreshAccessToken> {
    const res = await api.post<IRefreshAccessToken>(`${getURL("REFRESH")}`);
    cookies.setCookie(REFRESH_TOKEN, res.data.refresh_token, { path: "/" });

    return res.data;
  }

  const mutation = mutate(["useRefreshAccessToken"], refreshAccess, options);

  return mutation;
};