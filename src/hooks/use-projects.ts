import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from '@/types/api';
import type { Project } from '@/types/project.types';


const useProjects = () => {
  const url = `/api/projects`;

  const { data, error, isLoading } = useSWR<ApiResponse<Project[]>>(
    url,
    fetcher
  );

  const mutateProjects = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    projects: data?.data,
    mutateProjects,
  };
};

export default useProjects;