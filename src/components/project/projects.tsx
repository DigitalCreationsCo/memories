"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Error, Loading } from '@/components/common';
import { getAxiosError } from '@/utils/utils';
import axios from 'axios';
import { useProjects } from '@/hooks/use-projects';
import { useTranslations } from 'next-intl';
import { ApiResponse } from '@/types/api';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project.types';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { SelectionChangedEvent } from 'ag-grid-community';
import TableComponent from '../core/table-component';
import { User } from '@/types/user.types';
const Projects = ({ user }: { user: User }) => {
  const { isPending, isError, mutateAsync: getProjects } = useProjects();
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

  const leaveProject = async (project: Project) => {
    try {
      await axios.put<ApiResponse>(`/api/projects/${project.id}/members`);
      toast({ title: t('leave-project-success') });
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
          onDelete={leaveProject}
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

        {/* <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t('name')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('members')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('created-at')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {projects &&
              projects.map((project) => {
                return (
                  <tr
                    key={project.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-3">
                      {new Date(project.created_at).toDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          leaveProject(project);
                        }}
                      >
                        {t('leave-project')}
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table> */}
        </>
  );
};

export default Projects;