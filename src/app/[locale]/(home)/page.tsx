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
      <Projects user={user!} />
    </>
  );
};

export default AllProjects;