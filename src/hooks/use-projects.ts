import { UseMutationResult } from "@tanstack/react-query";
import { useMutationFunctionType  } from "@/types/api";
import { api } from "@/controllers/api/api";
import { getURL } from "@/utils/url.utils";
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
import { Project } from "@/types/project.types";

export const useProjects: useMutationFunctionType<undefined, any> = (
  options?: any,
) => {
  const { mutate } = UseRequestProcessor();

  const getProjectsData = async () => {
    const response = await api.get<Project[]>(`${getURL("PROJECTS")}`);
    return response["data"];
  };

  const mutation: UseMutationResult = mutate(
    ["useGetProjectsData"],
    getProjectsData,
    options,
  );

  return mutation;
};