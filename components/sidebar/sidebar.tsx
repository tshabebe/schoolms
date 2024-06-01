import { db } from "@/app/_db";

export const SidebarWrapper = async () => {
  const department = await db.query.department.findFirst();
  return (
    <aside className="h-screen w-48 border-r bg-secondary-50/40 border-divider z-[20] sticky top-0 flex flex-col">
      <div className="h-12 border-b border-divider">hello world</div>
      <div>{(department && "department") || "nothing to show"}</div>
    </aside>
  );
};
