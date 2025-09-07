"use client";

import { AlertTriangle, MapPin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UrgentHero() {
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            <h2 className="text-xl font-bold">Priority Alert</h2>
            <Badge className="bg-white/20 text-white hover:bg-white/30 font-semibold">
              URGENT
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">Breaking & Entering - Kolej 7</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Block C, Level 3, Room 304</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Reported: 2 minutes ago</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Reported by: Lim Wei Jie</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            View Location
          </Button>
          <Button 
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
          >
            Respond
          </Button>
        </div>
      </div>
    </div>
  );
}
