import { highlightedSidebarLinks } from "@/content/sidebar";
import { IconId } from "@/types/icon";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { SmartLink } from "./SmartLink";

interface MobileNavbarProps {
  onMenuClick: () => void;
}
export const MobileNavbar = ({ onMenuClick }: MobileNavbarProps) => {
  return (
    <header className="bg-light px-md py-base border-b flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="text-gray border p-2 rounded mr-base"
          onClick={onMenuClick}
        >
          <Icon id="griplines"></Icon>
        </button>
        <SmartLink
          href="/"
          className="font-display font-black text-lg text-dark"
        >
          Husker
        </SmartLink>
      </div>

      <div className="flex items-center space-x-xs">
        <div className="w-40 overflow-hidden flex justify-end space-x-xs">
          {highlightedSidebarLinks.map((link) => {
            return (
              <SmartLink
                key={link.href}
                href={link.href}
                className="text-gray border border p-2 rounded-md"
              >
                <Icon id={link.icon as IconId} />
              </SmartLink>
            );
          })}
        </div>

        <button
          className="text-gray border p-2 rounded-full"
          onClick={onMenuClick}
        >
          <Icon id="search"></Icon>
        </button>
      </div>
    </header>
  );
};
