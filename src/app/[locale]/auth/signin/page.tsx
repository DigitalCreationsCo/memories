"use client"

import { Input } from '@/components/ui/input';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getEnv } from '@/components/auth/actions'
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

const Signin = () => {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations('common');
  const { toast } = useToast();
  
  const [redirectPath, setRedirectPath] = useState<string>('');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const env = await getEnv();
        setRedirectPath(env?.REDIRECT_AFTER_SIGNIN || '/projects');

        if (status === 'authenticated') {
          router.push(redirectPath);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        toast({ 
          title: t('error'),
          description: 'Failed to initialize authentication'
        });
      }
    };

    initAuth();
  }, [status, router, toast, t, redirectPath]);

  const methods = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { email, password } = data;
      
      methods.reset();
      
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: redirectPath
      });

      if (!response) {
        throw new Error('Authentication failed');
      }

      if (response.error) {
        toast({ 
          title: t('signin-error'),
          description: response.error
        });
        return;
      }

      if (response.ok) {
        router.push(redirectPath);
      }

    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({ 
        title: t('signin-error'),
        description: error.message || 'An unexpected error occurred'
      });
    }
  };

  return (
    <>
      <div className="rounded-md bg-white p-6 shadow-sm">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
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
            {/* Password Field */}
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
                      placeholder={t('password-placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Forgot Password Link */}
            <p className="text-sm text-gray-600 text-right">
              <Link href="/auth/forgot-password">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  {t('forgot-password')}
                </span>
              </Link>
            </p>
            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {t('sign-in')}
            </Button>
          </form>
        </Form>
      </div>
      <p className="text-center text-sm text-gray-600">
        {t('dont-have-an-account')}
        <Link href="/auth/signup">
          <span className="font-medium text-indigo-600 hover:text-indigo-500">
            {t('create-a-free-account')}
          </span>
        </Link>
      </p>
    </>
  );
};

export default Signin;