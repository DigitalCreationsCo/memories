import { AllLocales } from "@/lib/App";
import { notFound } from "next/navigation";
import AuthLayout from "@/components/layouts/auth-layout";

export default function Layout( props: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

    if (!AllLocales.includes(props.params.locale)) notFound();
    
  return (
    <AuthLayout 
    heading="Reset Password" 
      description="Enter your new password below"
      >
      {props.children}
    </AuthLayout>
  );
}
