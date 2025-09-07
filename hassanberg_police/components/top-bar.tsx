"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function TopBar() {
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
    <div className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="text-sm md:text-base text-gray-700">
        <span className="font-medium text-gray-900">Current time:</span> {mounted ? now : "Loading..."}
      </div>
      <div className="flex items-center gap-3">
        <Badge className="bg-[#327da8] text-white">Unit Alpha-01</Badge>
        <span className="text-sm text-gray-600 hidden sm:inline">Officer: Demo User</span>
      </div>
    </div>
  );
}
