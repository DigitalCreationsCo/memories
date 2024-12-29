"use client"

import SideBarButtonsComponent from "@/components/core/sidebar-component";
import { SidebarProvider } from "@/components/ui/sidebar";
import ForwardedIconComponent from "@/components/common/generic-icon-component";
import PageLayout from "@/components/common/page-layout";
import useProject from "@/hooks/use-project";
import { useParams, useRouter } from "next/navigation";

export default function ProjectLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();
  //   use last section of path as projectId
    const projectId = useParams().project as string;
    const { project } = useProject(projectId)!;

  const sidebarNavItems: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[] = [];

  sidebarNavItems.push(
    {
      title: "Media",
      href: `/home/project/${projectId}/media`,
      icon: (
        <ForwardedIconComponent
          name="Image"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
  );



  if (!project) {
    router.push("/home");
  }

  return (
    <PageLayout
      backTo={"/"}
      title={project!.name}
      description={project!.description}
    >
      <SidebarProvider defaultOpen={false}>
        <SideBarButtonsComponent items={sidebarNavItems} />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-x-hidden pt-1">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </PageLayout>
  );
}