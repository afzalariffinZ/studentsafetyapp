"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock } from "lucide-react";

export default function Navbar() {
  const [now, setNow] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const date = new Date();
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) + ', ' + date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setNow(formatted);
    };
    
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 lg:px-6">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0">
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#327da8] to-[#2563eb] flex-shrink-0">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
            </div>
            <Link href="/" className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">
              <span className="hidden sm:block">Polis Bantuan</span>
              <span className="block sm:hidden">Polis</span>
            </Link>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hidden lg:flex text-xs">
            Emergency Response System
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-mono hidden md:inline text-xs sm:text-sm">{mounted ? now : "Loading..."}</span>
            <span className="font-mono text-xs block md:hidden">{mounted ? now.split(',')[1]?.trim().slice(0, 5) : "..."}</span>
          </div>
          <Badge className="bg-[#327da8] text-white text-xs px-1 sm:px-2">
            <span className="hidden sm:inline">Unit Alpha-01</span>
            <span className="sm:hidden">A-01</span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
