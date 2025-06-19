"use client";

import {
  BarChart3,
  Globe,
  MessageSquare,
  CheckSquare,
  Settings,
  User,
  Home,
  TrendingUp,
  FileText,
  Link,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const seoMenuItems = [
  {
    title: "SEO Report",
    icon: FileText,
    items: [
      {
        title: "base",
        url: "/seoreport/base",
      },
    ],
  },
];

const techStackItems = [
  {
    title: "Tech Stack",
    url: "/techstack",
  },
  {
    title: "Improvements",
    url: "/techstack/improve",
  },
  {
    title: "Recommendations",
    url: "/techstack/recommend",
  },
];

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/user-dashboard",
    icon: Home,
  },
  {
    title: "Websites",
    url: "/websites",
    icon: Globe,
  },
];

const accountItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-blue-200">
      <SidebarHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center space-x-2 px-2 py-3">
          <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">SEO Platform</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-blue-50 hover:text-blue-700"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SEO Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">
            SEO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-blue-50 hover:text-blue-700">
                      <FileText className="h-4 w-4" />
                      <span>SEO Report</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {seoMenuItems[0].items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="hover:bg-blue-50 hover:text-blue-700"
                          >
                            <a href={subItem.url}>{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tech Stack Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">
            Tech Stack
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-blue-50 hover:text-blue-700">
                      <TrendingUp className="h-4 w-4" />
                      <span>Tech Stack</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {techStackItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="hover:bg-blue-50 hover:text-blue-700"
                          >
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarFooter className="flex justify-center items-center mt-auto pb-6">
          <SignOutButton>
            <Button className="w-40 h-9 bg-slate-900 text-white hover:bg-slate-700">
              Logout
            </Button>
          </SignOutButton>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
