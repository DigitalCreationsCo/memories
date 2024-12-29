"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getEnv } from '@/components/auth/actions';

// Add form schema
const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

const MagicLink = () => {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations('common');

  // Replace formik with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  let redirectAfterSignIn= useRef("")
  useEffect(() => {
    async function authenticate() {
      redirectAfterSignIn.current = await (await getEnv()).REDIRECT_AFTER_SIGNIN
      if (status === 'authenticated') {
        router.push(redirectAfterSignIn.current);
      }
    }
    authenticate()

  }, [status])

  const onSubmit = async (values: FormValues) => {
    const response = await signIn('email', {
      email: values.email,
      redirect: false,
      callbackUrl: redirectAfterSignIn.current,
    });

    form.reset();

    if (response?.error) {
      toast({ description: t('signin-error') });
      return;
    }

    if (response?.status === 200 && response?.ok) {
      toast({ description: t('signin-success') });
      return;
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    {`We'll email you a magic link for a password-free sign in.`}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isDirty}
            >
              {t('send-magic-link')}
            </Button>
          </form>
        </Form>
        
        <div className="divider" />
        
        <div className="space-y-3">
          <Link href="/auth/signin" className="btn-outline btn w-full">
            {t('sign-in-with-password')}
          </Link>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600">
        {t('dont-have-an-account')}
        <Link 
          href="/authsignup" 
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          &nbsp;{t('create-a-free-account')}
        </Link>
      </p>
    </>
  );
};

export default MagicLink;
