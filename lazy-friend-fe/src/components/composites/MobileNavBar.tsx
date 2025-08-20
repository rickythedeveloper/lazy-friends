import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

interface NavBarItem {
  label: string;
  href: string;
}

interface MobileNavBarProps {
  title: string;
  items: NavBarItem[];
}

export function MobileNavBar({ title, items }: MobileNavBarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={
          "text-2xl flex justify-end p-4 sticky top-0 z-50 bg-background"
        }
      >
        <SheetTrigger asChild>
          <GiHamburgerMenu className={"cursor-pointer"} />
        </SheetTrigger>
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className={"text-xl"}>{title}</SheetTitle>
        </SheetHeader>

        <div className={"p-4 flex flex-col gap-4"}>
          {items.map((item) => {
            return (
              <Link key={item.label} href={item.href} className={"text-2xl"}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
