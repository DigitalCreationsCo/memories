import fetcher from '@/lib/fetcher';
import type { Project } from '@/types/project.types';
import useSWR from 'swr';
import type { ApiResponse } from '@/types/api';

const useProject = (slug: string | undefined) => {
  const url = `/api/projects/${slug}`;

  const { data, error, isLoading } = useSWR<ApiResponse<Project>>(
    slug ? url : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    project: data?.data,
  };
};

export default useProject;