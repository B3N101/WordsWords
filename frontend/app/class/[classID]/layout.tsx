import { SideBar } from "@/components/sidebar/sideBar";


export default function Layout({ children, params}: { children: React.ReactNode, params: { classID: string } }) {
    return (
      <div className="flex">
        <SideBar classID={params.classID}/>
        <div className="w-full">
          {children}
        </div>
      </div>
    );
}
  