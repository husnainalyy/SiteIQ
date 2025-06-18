import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "@/app/globals.css"; // adjust if your path is different

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Dashboard",
    description: "Simple Dashboard Layout",
};

export default function DashboardLayout({ children }) {
    return (
        <div className={inter.className}>
            <SidebarProvider>
                <div className="flex min-h-screen">
                    <AppSidebar />
                    <main className="flex-1 w-full border bg-gray-50 p-4">{children}</main>
                </div>
            </SidebarProvider>
        </div>
    );
}
