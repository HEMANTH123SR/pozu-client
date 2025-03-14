import { Navbar } from "@/components/header";
import { RightSideMenu } from "@/components/right-side-menu";
export default function Home() {
  return (
    <main className="bg-gray-200 flex flex-col h-screen w-screen overflow-x-hidden">
      <Navbar />
      <div className="flex">
        <RightSideMenu />
      </div>
    </main>
  );
}
