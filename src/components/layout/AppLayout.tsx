import { Outlet } from "react-router-dom";
import UtilityBar from "./UtilityBar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b1326]">
      <UtilityBar />
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
