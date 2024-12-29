import { useQueryFunctionType } from "@/types/api";
import { api } from "@/controllers/api/api";
import { getURL } from "@/utils/url.utils";
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
import { Project } from "@/types/project.types";

export const useProject  : useQueryFunctionType<string, Project> = (
  projectId: string,
  options?: any,
) => {
  const { query } = UseRequestProcessor();

  const getProjectData = async () => {
    const response = await api.get<Project>(`${getURL("PROJECT")}/${projectId}`);
    return response["data"];
  };

  const queryResult = query(
    ["useGetProjectData"],
    getProjectData,
    options,
  );

  return queryResult;
};