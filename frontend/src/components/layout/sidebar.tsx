"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Bot,
  Calendar,
  Settings,
  User,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  role?: "student" | "mentor" | "admin";
}

const studentNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Courses", href: "/courses", icon: BookOpen },
  { title: "Assignments", href: "/assignments", icon: FileText },
  { title: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { title: "Live Sessions", href: "/sessions", icon: Calendar },
  { title: "Certificates", href: "/certificates", icon: GraduationCap },
];

const mentorNavItems = [
  { title: "Dashboard", href: "/mentor/dashboard", icon: LayoutDashboard },
  { title: "My Courses", href: "/mentor/courses", icon: BookOpen },
  { title: "Assignments", href: "/mentor/assignments", icon: FileText },
  { title: "Live Sessions", href: "/mentor/sessions", icon: Calendar },
  { title: "Students", href: "/mentor/students", icon: User },
];

export function Sidebar({ role = "student" }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "mentor" ? mentorNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Lumina</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t p-4">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
