import { SideBar } from "@/components/sidebar/sideBar";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex">
        <SideBar/>
        <div className="w-full">
          {children}
        </div>
      </div>
    );
  }
  