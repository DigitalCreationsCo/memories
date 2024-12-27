import fetcher from '@/lib/fetcher';
import { Invitation } from '@/db/queries/types';
import useSWR from 'swr';
import { ApiResponse } from '@/types/api';

const useInvitation = (token: string) => {
  const url = `/api/invitations/${token}`;

  const { data, error, isLoading } = useSWR<
    ApiResponse<Invitation>
  >(token ? url : null, fetcher);

  return {
    isLoading,
    isError: error,
    invitation: data?.data,
  };
};

export default useInvitation;