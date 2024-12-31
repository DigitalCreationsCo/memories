"use client"

import SideBarButtonsComponent from "@/components/core/sidebar-component";
import { SidebarProvider } from "@/components/ui/sidebar";
import ForwardedIconComponent from "@/components/common/generic-icon-component";
import PageLayout from "@/components/common/page-layout";
import { useProject } from "@/hooks/use-project";
import { usePathname,useRouter } from "next/navigation";
import { Project } from "@/types/project.types";

export default function ProjectLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();

    const projectId = usePathname().split('/').pop() as string;
    // const { data: project } = useProject(projectId)

    const project:Project = {
      id: '1',
      name: 'New Project',
      description: "a anew project",
      user_id: '1',
      'created_at': new Date(),
      updated_at: new Date()
    }

  const sidebarNavItems: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[] = [];

  sidebarNavItems.push(
    {
      title: "Media",
      href: `/projects/${projectId}/`,
      icon: (
        <ForwardedIconComponent
          name="Image"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
    {
      title: "Albums",
      href: `/projects/${projectId}/`,
      icon: (
        <ForwardedIconComponent
          name="Album"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
  );



  if (!project) {
    router.push("/projects");
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