import { useQueryFunctionType  } from "@/types/api";
import { api } from "@/controllers/api/api";
import { getURL } from "@/utils/url.utils";
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
import { User } from "@/types/user.types";

export const useUser: useQueryFunctionType<undefined, User> = (
  options?,
) => {
  const { query } = UseRequestProcessor();

  const getUserData = async () => {
    const response = await api.get<User>(`${getURL("CURRENT_USER")}`);
    return response["data"];
  };

  const queryResult = query(
    ["useGetUserData"],
    getUserData,
    options,
  );

  return queryResult;
};
