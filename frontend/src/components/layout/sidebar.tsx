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
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Courses", href: "/courses", icon: BookOpen },
  { title: "Assignments", href: "/assignments", icon: FileText },
  { title: "AI Coach", href: "/ai-assistant", icon: Bot, badge: "AI" },
  { title: "Sessions", href: "/sessions", icon: Calendar },
  { title: "Certificates", href: "/certificates", icon: GraduationCap },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  role?: "student" | "mentor" | "admin";
}

export function Sidebar({ userName, userEmail, userAvatar, role = "student" }: SidebarProps) {
  const pathname = usePathname();

  const displayName = userName || "Learner";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">Lumina</span>
            <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              AI
            </span>
          </div>
        </Link>
      </div>

      {/* User Section */}
      <div className="px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}&apos;s Workspace</p>
            <p className="text-xs text-muted-foreground truncate">
              {role === "mentor" ? "Mentor" : "Learning Journey"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  isActive && "bg-primary/10 font-medium text-primary hover:bg-primary/15"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-3">
        <nav className="space-y-1">
          <Link href="/profile">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 font-normal",
                pathname === "/profile" && "bg-muted font-medium"
              )}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 font-normal",
                pathname === "/settings" && "bg-muted font-medium"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="text-xs">Sign out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
