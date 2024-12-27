"use client"

import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useInvitation from '@/hooks/use-invitation';
import { Loading, Error as ErrorComponent } from '@/components/shared';

const invitationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(7, 'Password must be at least 7 characters'),
});

type InvitationValues = z.infer<typeof invitationSchema>;

const JoinWithInvitation = ({
  inviteToken,
  next,
}: {
  inviteToken: string;
  next: string;
}) => {
  const router = useRouter();
  const t = useTranslations('common');
  const { toast } = useToast();
  const { isLoading, isError, invitation } = useInvitation(inviteToken);

  const methods = useForm<InvitationValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      name: '',
      email: invitation?.email || '',
      password: '',
    },
  });

  const onSubmit = async (data: InvitationValues) => {
    try {
      const response = await fetch('/api/auth/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Join failed');
      }

      methods.reset();
      toast({ title: t('successfully-joined') });
      router.push(next || '/auth/signin');
    } catch (error) {
      toast({ 
        title: t('join-error'),
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t('your-name')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder={t('email-placeholder')}
                  disabled={!!invitation?.email}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={t('password')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t('create-account')}
        </Button>
      </form>
    </Form>
  );
};

export default JoinWithInvitation;