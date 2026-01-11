import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl py-6 px-4 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
