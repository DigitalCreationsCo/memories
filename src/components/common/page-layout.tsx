"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ForwardedIconComponent from "@/components/common/generic-icon-component";

export default function PageLayout({
  title,
  description,
  children,
  button,
  betaIcon,
  backTo = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  button?: React.ReactNode;
  betaIcon?: boolean;
  backTo?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-1 flex-col justify-between overflow-auto overflow-x-hidden bg-background">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between gap-4 space-y-0.5 pb-2 pt-5">
            <div className="flex w-full flex-col">
              <div className="flex items-start gap-2">
                {backTo && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <ForwardedIconComponent
                      name="ChevronLeft"
                      className="flex cursor-pointer"
                    />
                  </Button>
                )}
                <div>
                  <h2
                    className="text-2xl font-medium tracking-tight"
                    data-testid="mainpage_title"
                    >
                    {title}
                    {betaIcon && <span className="store-beta-icon">Beta</span>}
                  </h2>
                  {description && <p className="text-muted-foreground">{description}</p>}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">{button && button}</div>
          </div>
        </div>
        <div className="flex shrink-0 px-6">
          <Separator className="flex" />
        </div>
        <div className="flex flex-1 p-6 pt-7">{children}</div>
      </div>
    </div>
  );
}