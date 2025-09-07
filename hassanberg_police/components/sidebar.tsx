"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, List, AlertTriangle, BarChart3, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/incidents", label: "Incidents", icon: List },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  const NavContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-[#327da8] to-[#2563eb] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Officer Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#327da8] to-[#2563eb] flex items-center justify-center text-white text-sm font-semibold">
            DU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Demo User</p>
            <p className="text-xs text-gray-500">Officer • Online</p>
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile Menu Button - positioned absolutely to avoid layout shift */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-2 left-2 z-[60] bg-white/90 backdrop-blur border border-gray-200 shadow-sm hover:bg-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex min-h-[calc(100vh-4rem)] w-64 flex-col border-r border-gray-200 bg-white">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-gray-200 bg-white z-50 lg:hidden flex transform transition-transform duration-300 ease-in-out">
            {/* Header space for mobile */}
            <div className="h-14 sm:h-16 border-b border-gray-200 flex items-center px-4">
              <h2 className="font-semibold text-gray-900">Navigation</h2>
            </div>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
