"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Bot,
  Calendar,
  LayoutDashboard,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/courses"))}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/assignments"))}
          >
            <FileText className="mr-2 h-4 w-4" />
            Assignments
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/ai-assistant"))}
          >
            <Bot className="mr-2 h-4 w-4" />
            AI Assistant
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/sessions"))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Live Sessions
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/profile"))}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/login"))}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
