"use client"

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'
import useProjects from '@/hooks/use-projects';
import { useTranslations } from 'next-intl';

const Projects = () => {
  const t = useTranslations('common');
  const { status } = useSession();
  const router = useRouter()

  const { projects } = useProjects()

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
  }

  useEffect(() => {
    if (projects === null) {
      toast({ title: t('no-active-project') });
      return;
    }

    router.push(`/home`);
  });

  return (
    <>
      <div className="mb-6 flex w-1/2 flex-col items-center gap-4 p-3">
        <h3>{t('choose-project')}</h3>
        <div className="w-3/5 rounded bg-white dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"></div>
      </div>
    </>
  );
};

export default Projects;