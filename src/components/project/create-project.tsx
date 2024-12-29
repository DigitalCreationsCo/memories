import { getAxiosError } from '@/utils/utils';
import type { Project } from '@/types/project.types';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import useProjects from '@/hooks/use-projects';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog as Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import type { ApiResponse } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FormInput } from 'lucide-react';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const CreateProject = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const t = useTranslations('common');
  const { mutateProjects } = useProjects();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (values: CreateProjectFormData) => {
    try {
      const { data } = await axios.post<ApiResponse<Project>>('/api/projects/', values);

      if (data.data) {
        toast({ title: t('project-created') });
        mutateProjects();
        form.reset();
        setVisible(false);
      }
    } catch (error: any) {
      toast({ description: getAxiosError(error) });
    }
  };

  return (
    <Dialog open={visible}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
          <DialogTitle className="font-bold">{t('create-project')}</DialogTitle>
          <DialogContent>
            <div className="mt-2 flex flex-col space-y-4">
              <p>{t('project-description')}</p>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-name')}</FormLabel>
                    <FormControl>
                      <FormInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button
              type="submit"
              color="primary"
              disabled={form.formState.isSubmitting}
            >
              {t('create-project')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setVisible(false)}
            >
              {t('close')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
};

export default CreateProject;