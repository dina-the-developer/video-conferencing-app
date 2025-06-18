import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import StreamVideoProvider from "@/providers/StreamClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex-1 p-4 bg-gray-950">
        <SidebarTrigger className="text-white cursor-pointer" />
        <StreamVideoProvider>{children}</StreamVideoProvider>
      </main>
    </SidebarProvider>
  );
}
