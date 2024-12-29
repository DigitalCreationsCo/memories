"use client"

import CustomLink from "@/components/custom-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type SideBarButtonsComponentProps = {
  items: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[];
  handleOpenNewFolderModal?: () => void;
};

const SideBarButtonsComponent = ({ items }: SideBarButtonsComponentProps) => {
  const pathname = usePathname();

  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible={isMobile ? "icon" : "none"} className="border-none">
      <SidebarContent className="pr-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <CustomLink href={item.href!}>
                    <SidebarMenuButton
                      isActive={
                        item.href ? pathname.endsWith(item.href) : false
                      }
                      data-testid={`sidebar-nav-${item.title}`}
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span className="block max-w-full truncate">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </CustomLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBarButtonsComponent;