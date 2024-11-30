import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/auth"
import { User } from "next-auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    
    return <SidebarProvider>
          <AppSidebar user={session?.user as User}/>
        <main className='w-full'>
            <SidebarTrigger />
            {children}
        </main>
    </SidebarProvider>
}
