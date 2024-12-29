"use client"

import { Input } from '@/components/ui/input';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getParsedCookie } from '@/lib/cookie';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(7, 'Password must be at least 7 characters'),
    project: z.string().min(3, 'Project name must be at least 3 characters'),
});
  
type SignupValues = z.infer<typeof signupSchema>;
  
const Join = () => {
    const { status } = useSession();
    const router = useRouter();
    const t = useTranslations('common');
    const { toast } = useToast();
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [next, setNext] = useState<string | null>(null);
  
    const methods = useForm<SignupValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        project: '',
      },
    });
  
    useEffect(() => {
      async function fetchCookie() {
        const { token, url } = await getParsedCookie();
        setInviteToken(token);
        setNext(url);
      }
      fetchCookie();
    }, []);
  
    useEffect(() => {
      if (status === 'authenticated') {
        router.push('/');
      }
    }, [status, router]);
  
    const onSubmit = async (data: SignupValues) => {
      try {
        const response = await fetch('/api/auth/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Signup failed');
        }
  
        methods.reset();
        toast({ title: t('successfully-joined') });
        router.push('/auth/signin');
      } catch (error) {
        toast({ 
          title: t('signup-error'),
          variant: 'destructive'
        });
      }
    };
  
    return (
      <>
        <div className="rounded-md bg-white p-6 shadow-sm">
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
                name="project"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t('project-name')}
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
        </div>
        <p className="text-center text-sm text-gray-600">
          {t('already-have-an-account')}{' '}
          <Link href="/auth/signin">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              {t('sign-in')}
            </span>
          </Link>
        </p>
      </>
    );
};

export default Join;