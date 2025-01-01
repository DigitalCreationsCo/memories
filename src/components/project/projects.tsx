"use client"

import { Error, Loading } from '@/components/common';
import { getAxiosError } from '@/utils/utils';
import axios from 'axios';
import { useProjects } from '@/hooks/use-projects';
import { useTranslations } from 'next-intl';
import { ApiResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project.types';
import { useEffect, useState } from 'react';
import { SelectionChangedEvent } from 'ag-grid-community';
import TableComponent from '../core/table-component';
import { User } from '@/types/user.types';

const Projects = ({ user }: { user: User }) => {

  const { isPending, isError, mutateAsync: getProjects } = useProjects().getProjects;
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const t = useTranslations('common');

  const getProjectsData = async () => {
    try {
      if (user) {
        const projects = await getProjects({ user_id: user.id })
        if (projects) {
          setProjects(projects)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getProjectsData()
  }, [user, getProjects]);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return (
    <div className='px-5 py-3'>
      <Error />
      </div>)
  }

  const leaveProject = async (projectId: string) => {
    try {
      await axios.put<ApiResponse>(`/api/projects/${projectId}/members`);
      toast({ title: t('leave-project-success') });
      await getProjectsData();
    } catch (error: any) {
      toast({ description: getAxiosError(error) });
    }
  };

  const keysList = projects.map((project) => ({
    id: project.id,
    name: project.name,
    created_at: project.created_at,
  }));

  const columnDefs = [
    { headerName: 'Name', field: 'name' },
    // { headerName: 'Members', field: 'members' },
    { headerName: 'Created At', field: 'created_at' },
    { headerName: 'Actions', field: 'actions' },
  ]
  return (
    <>
      <div className="flex h-full w-full flex-col justify-between grow">
        <TableComponent
          key={"projects"}
          // deleteRow={leaveProject}
          overlayNoRowsTemplate="No data available"
          onSelectionChanged={(event: SelectionChangedEvent) => {
            setSelectedRows(event.api.getSelectedRows().map((row) => row.id));
          }}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          columnDefs={columnDefs}
          rowData={keysList}
        />
      </div>
    </>
  );
};

export default Projects;