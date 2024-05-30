import { ReactNode } from "react";
import { DropdownComp } from "./user-dropdown";

export const NavbarWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <div className="flex justify-between h-12 px-10  items-center bg-secondary-50/40 border-divider border-b">
        <div className="ml-auto">some icons</div>
        <DropdownComp />
      </div>
      {children}
    </div>
  );
};
