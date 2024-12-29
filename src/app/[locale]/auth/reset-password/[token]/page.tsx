import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordPage = () => {
  const t = useTranslations('common');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // TODO: Implement password reset logic
      toast({
        description: t('password-reset-success'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: t('password-reset-error'),
      });
    }
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('new-password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('enter-new-password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirm-password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('confirm-new-password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isDirty}
          >
            {t('reset-password')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
