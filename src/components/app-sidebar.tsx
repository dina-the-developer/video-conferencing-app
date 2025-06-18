"use client";
import { VideoIcon } from "lucide-react";
import { menuLinks } from "@/constants";
import { useSession } from "@/context/SessionContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { redirect } from "next/navigation";

export function AppSidebar() {
  const user = useSession();
  if (!user) {
    // If user is not logged in, redirect to login page
    redirect("/login");
  }
  return (
    <Sidebar>
      <SidebarHeader className="text-2xl text-white p-2 border-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <VideoIcon width={40} height={40} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="text-white border-0 pt-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.id}>
                    <SidebarMenuButton asChild>
                      <a
                        href={link.path}
                        className="h-10 mb-3"
                        title={link.title}
                      >
                        <Icon className="p-0 ml-1" />
                        {/* <span>{link.title}</span> */}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
