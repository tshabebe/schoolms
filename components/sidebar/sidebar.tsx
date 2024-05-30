"use client";
import { Sidebar } from "./sidebar.styles";
export const SidebarWrapper = () => {
  return (
    <aside className="h-screen z-[20] sticky top-0 flex flex-col">
      <div className="w-48 bg-secondary-50/40 grow border-r border-divider">
        hello world
      </div>
    </aside>
  );
};
