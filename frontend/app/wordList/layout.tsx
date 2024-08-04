import { SideBar } from "@/components/sideBar";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex flex-col flex-1 w-full m-auto h-screen gap-6">
        {children}
        <SideBar/>
      </div>
    );
  }
  