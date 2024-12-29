import { useMutationFunctionType } from "@/types/api";
import { api } from "@/controllers/api/api";
import { getURL } from "@/utils/url.utils";
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
import { REFRESH_TOKEN } from "@/constants/constants";
import cookies from "cookies-next";

export const useLogout: useMutationFunctionType<undefined, void> = (
  options?,
) => {
  const { mutate } = UseRequestProcessor();

  async function logoutUser(): Promise<any> {
    const res = await api.post(`${getURL("LOGOUT")}`);
    return res.data;
  }

  const mutation = mutate(["useLogout"], logoutUser, {
    onSuccess: () => {
      cookies.deleteCookie(REFRESH_TOKEN);
      console.log("logout success");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });

  return mutation;
};