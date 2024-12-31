"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { getAxiosError } from '@/utils/utils';
import type { ApiResponse } from '@/types/api';

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations('common');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  if (status === 'authenticated') {
    router.push('/projects');
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post<ApiResponse>('/api/auth/forgot-password', values);
      form.reset();
      toast({
        description: t('password-reset-link-sent'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: getAxiosError(error),
      });
    }
  };

  return (
    <>
      <div className="rounded-md bg-white p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('email')}
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
              {t('email-password-reset-link')}
            </Button>
          </form>
        </Form>
      </div>
      <p className="text-center text-sm text-gray-600">
        {t('already-have-an-account')}&nbsp;
        <Link 
          href="/auth/signin" 
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {t('sign-in')}
        </Link>
      </p>
    </>
  );
};

export default ForgotPassword;
