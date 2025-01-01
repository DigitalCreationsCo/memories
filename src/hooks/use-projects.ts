import { useMutationFunctionType  } from "@/types/api";
import { api } from "@/controllers/api/api";
import { getURL } from "@/utils/url.utils";
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
import { Project } from "@/types/project.types";

export const useProjects = (
  options?: any,
) => {
  const { mutate } = UseRequestProcessor();

  const getProjectsData = async () => {
    const response = await api.get<Project[]>(`${getURL("PROJECTS")}`);
    return response["data"];
  };

  const createProject = async (projectData: Partial<Project>) => {
    const response = await api.post<Project>(
      `${getURL("PROJECTS")}`,
      projectData
    );
    return response["data"];
  };

  const mutations = {
    getProjects: mutate(["useGetProjectsData"], getProjectsData, options),
    createProject: mutate(["useCreateProject"], createProject, options),
  };

  return mutations;
};