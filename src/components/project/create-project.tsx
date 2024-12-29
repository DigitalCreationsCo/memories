import { getAxiosError } from '@/utils/utils';
import { useForm } from 'react-hook-form';
import { useProjects } from '@/hooks/use-projects';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog , DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import type { ApiResponse } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { createProject } from '@/db/queries/project';
import { Input } from '../ui/input';
import { User } from '@/types/user.types';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  user_id: z.string(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const CreateProject = ({
  visible,
  setVisible,
  user,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  user: User;
}) => {
  const t = useTranslations('common');
  const { mutateAsync } = useProjects();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (values: CreateProjectFormData) => {
    try {
      console.log(`values `, values);
      const project = await mutateAsync({...values, user_id: user.id});
      console.log(`project `, project);
      if (project) {
        toast({ title: t('project-created') });
        form.reset();
        setVisible(false);
      }
    } catch (error: any) {
      toast({ description: getAxiosError(error) });
    }
  };

  return (  
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
    <Dialog open={visible} onOpenChange={setVisible}>
    <DialogContent>
          <DialogTitle className="font-bold">{t('create-project')}</DialogTitle>
              <DialogDescription>
                <p>{t('create-project-description')}</p>
              </DialogDescription>
            <div className="mt-2 flex flex-col space-y-4">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-description')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
    </DialogContent>
    </Dialog>
        </form>
      </Form>
  );
};

export default CreateProject;