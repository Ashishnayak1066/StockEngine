import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, TrendingUp, Settings, LineChart, PieChart, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: TrendingUp, label: "Predictions", href: "/predictions" },
    { icon: LineChart, label: "Analytics", href: "/analytics" },
    { icon: PieChart, label: "Portfolio", href: "/portfolio" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-mono font-bold tracking-tighter text-primary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            StockPred
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group cursor-pointer",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(59,130,246,0.1)] border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="bg-accent/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Market Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-mono font-medium text-green-500">LIVE</span>
            </div>
          </div>

          {user?.name && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
              </div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}
