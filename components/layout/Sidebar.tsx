"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { getSessionItem, setSessionItem } from "@/lib/storage/utils";

interface SidebarProps {
  className?: string;
}

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export default function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load collapsed state from sessionStorage after mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
    const savedState = getSessionItem<boolean>(SIDEBAR_COLLAPSED_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState);
    }
  }, []);

  // Save collapsed state to sessionStorage
  useEffect(() => {
    if (isMounted) {
      setSessionItem(SIDEBAR_COLLAPSED_KEY, isCollapsed);
    }
  }, [isCollapsed, isMounted]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    {
      label: "Dashboard",
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: "Proposals",
      href: ROUTES.PROPOSALS,
      icon: FileText,
    },
    {
      label: "Templates",
      href: ROUTES.TEMPLATES,
      icon: FolderOpen,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <aside
      className={cn(
        "bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-full transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleCollapse}
        className={cn(
          "absolute -right-3 top-4 z-10 p-1.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-lg transition-all duration-200",
          "hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>

      <nav className={cn("p-4 space-y-2", isCollapsed && "px-2")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-colors duration-200",
                isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-4 py-3",
                isActive(item.href)
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
          <button
            className={cn(
              "flex items-center rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full transition-colors duration-200",
              isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-4 py-3"
            )}
            onClick={() => {
              logout();
              router.push(ROUTES.HOME);
            }}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}

