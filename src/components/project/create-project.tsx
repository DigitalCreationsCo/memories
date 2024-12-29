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
import { FormInput } from 'lucide-react';
import { createProject } from '@/db/queries/project';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  user_id: z.string(),
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
  const { mutateAsync } = useProjects();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (values: CreateProjectFormData) => {
    try {
      // const { data } = await axios.post<ApiResponse<Project>>('/api/projects/', values);

      const project = await createProject(values);

      if (project) {
        toast({ title: t('project-created') });
        mutateAsync({});
        form.reset();
        setVisible(false);
      }
    } catch (error: any) {
      toast({ description: getAxiosError(error) });
    }
  };

  return (  
    <Dialog open={visible} onOpenChange={setVisible}>
    <DialogContent>
          <DialogTitle className="font-bold">{t('create-project')}</DialogTitle>
              <DialogDescription>
                <p>{t('project-description')}</p>
              </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
            <div className="mt-2 flex flex-col space-y-4">
              
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
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-description')}</FormLabel>
                    <FormControl>
                      <FormInput {...field} />
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
        </form>
      </Form>
    </DialogContent>
    </Dialog>
  );
};

export default CreateProject;