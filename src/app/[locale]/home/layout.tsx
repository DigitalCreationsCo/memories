import SideBarButtonsComponent from "@/components/core/sidebar-component";
import { SidebarProvider } from "@/components/ui/sidebar";
import ForwardedIconComponent from "@/components/common/generic-icon-component";
import PageLayout from "@/components/common/page-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <main className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {children}
      </div>
    </main>
  );
}