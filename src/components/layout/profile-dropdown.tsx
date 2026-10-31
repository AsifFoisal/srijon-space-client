"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarCheck },
];

export function ProfileDropdown({ light = false }: { light?: boolean }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  async function handleLogout() {
    try {
      await logout();
      toast.success("You're signed out. See you soon.");
      router.push("/");
    } catch {
      toast.error("We couldn't sign you out. Please try again.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-colors",
            light
              ? "border-white/20 bg-white/10 hover:bg-white/20"
              : "border-line bg-paper hover:border-ink/25",
          )}
        >
          <Avatar src={user.avatar} name={user.name} size={32} />
          <span
            className={cn(
              "hidden text-[13px] font-medium sm:block",
              light ? "text-on-dark" : "text-ink",
            )}
          >
            {user.name.split(" ")[0]}
          </span>
          <ChevronDown
            className={cn("size-3.5", light ? "text-on-dark/70" : "text-stone")}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-0">
        <DropdownMenuLabel className="flex items-center gap-3 border-b border-line/70 p-4">
          <Avatar src={user.avatar} name={user.name} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {user.name}
            </p>
            <p className="truncate text-xs text-stone">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <div className="p-2">
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink"
              >
                <item.icon className="size-4 text-stone" aria-hidden="true" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="my-0" />
        <div className="p-2">
          <DropdownMenuItem
            onSelect={handleLogout}
            className="text-ink focus:bg-accent-soft focus:text-accent-deep"
          >
            <LogOut className="size-4 text-stone" aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
