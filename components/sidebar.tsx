"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package2,
  LayoutDashboard,
  BoxSelect as BoxSeam,
  History,
  Users2,
  Settings,
  ChevronLeft,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Products",
      icon: BoxSeam,
      href: "/",
      color: "text-violet-500",
    },
    {
      label: "Categories",
      icon: Package2,
      color: "text-pink-700",
      href: "/categories",
    },
    {
      label: "Reports",
      icon: BarChart3,
      color: "text-emerald-500",
      href: "/reports",
    },
    {
      label: "History",
      icon: History,
      href: "/history",
      color: "text-blue-500",
    },
    {
      label: "Users",
      icon: Users2,
      href: "/users",
      color: "text-rose-500",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-gray-500",
    },
  ];

  return (
    <div
      className={cn(
        "relative h-full border-r bg-card transition-all duration-300",  // Changed bg-white to bg-card
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {isOpen && (
          <h1
            className={cn(
              "font-bold transition-all duration-300 flex items-center gap-2",
              isOpen ? "text-xl" : "scale-0"
            )}
          >
            <Package2 className="h-6 w-6" />
            <span className={cn(isOpen ? "opacity-100" : "opacity-0")}>
              Inventory
            </span>
          </h1>
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-all", !isOpen && "rotate-180")}
          />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)] px-3">
        <div className="space-y-2 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"  // Changed from text-gray-500 to text-muted-foreground
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                <span
                  className={cn(
                    "transition-all duration-300",
                    !isOpen && "opacity-0 translate-x-28 overflow-hidden"
                  )}
                >
                  {route.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}