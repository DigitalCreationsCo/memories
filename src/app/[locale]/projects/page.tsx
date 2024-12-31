"use client"

import { CreateProject, Projects } from '@/components/project';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

const AllProjects = () => {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('common');
  const user = useUser().data

  return (
    <>
      <div className="flex items-center justify-between p-3">
        <h4>{t('all-projects')}</h4>
        <Button
          variant='outline'
          color="primary"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t('create-project')}
        </Button>
      </div>
      <CreateProject visible={visible} setVisible={setVisible} user={user!} />

      {/* <>
      <div className="mb-6 flex w-1/2 flex-col items-center gap-4 p-3">
        <h3>{t('choose-project')}</h3>
        <div className="w-3/5 rounded bg-white dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"></div>
      </div>
      </> */}
      <Projects user={user!} />
    </>
  );
};

export default AllProjects;