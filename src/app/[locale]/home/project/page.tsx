"use client"

import { CreateProject, Projects } from '@/components/project';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const AllProjects = () => {
  const [visible, setVisible] = useState(false);

  const t = useTranslations('common');

  return (
    <>
      <div className="flex items-center justify-between">
        <h4>{t('all-projects')}</h4>
        <Button
          color="primary"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t('create-project')}
        </Button>
      </div>
      <CreateProject visible={visible} setVisible={setVisible} />
      <Projects />
    </>
  );
};

export default AllProjects;