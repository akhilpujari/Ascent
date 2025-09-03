import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";


export default function App() {
  return (
    <div className="flex">
      {/* Sidebar stays left */}
      <SideBar />

      {/* Main content */}
      <main className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Outlet /> {/* Child routes render here */}
      </main>
      
    </div>
  );
}