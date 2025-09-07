"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { AlertTriangle, Clock, Calendar, MapPin } from "lucide-react";
import MapWrapper from './map-wrapper';
import UrgentHero from './urgent-hero';

// Mock data for demonstration
const monthlyReports = [
  { month: 'Jan', reports: 45 },
  { month: 'Feb', reports: 52 },
  { month: 'Mar', reports: 38 },
  { month: 'Apr', reports: 67 },
  { month: 'May', reports: 55 },
  { month: 'Jun', reports: 71 },
];

const recentReports = [
  { id: 1, type: 'Emergency', location: 'Jl. Sudirman', time: '14:30', status: 'Active' },
  { id: 2, type: 'Theft', location: 'Jl. Thamrin', time: '13:15', status: 'Resolved' },
  { id: 3, type: 'Accident', location: 'Jl. Gatot Subroto', time: '12:45', status: 'In Progress' },
  { id: 4, type: 'Emergency', location: 'Jl. Kuningan', time: '11:20', status: 'Active' },
];

const locationData = [
  { location: 'Jl. Sudirman', count: 23 },
  { location: 'Jl. Thamrin', count: 18 },
  { location: 'Jl. Gatot Subroto', count: 15 },
  { location: 'Jl. Kuningan', count: 12 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <UrgentHero />

      {/* Quick stats, smaller emphasis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" /> Active Reports
            </CardDescription>
            <CardTitle className="text-xl sm:text-2xl text-red-700">24</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-amber-600 text-sm">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> Avg Response
            </CardDescription>
            <CardTitle className="text-xl sm:text-2xl text-amber-700">8.5m</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-blue-600 text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" /> This Month
            </CardDescription>
            <CardTitle className="text-xl sm:text-2xl text-blue-700">71</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-green-600 text-sm">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> Resolution Rate
            </CardDescription>
            <CardTitle className="text-xl sm:text-2xl text-green-700">89%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Map + Recent feed two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <Card className="lg:col-span-1 xl:col-span-2 border-0 shadow-md">{' '}
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#327da8]" />
              Live Incidents Map
            </CardTitle>
            <CardDescription className="text-sm">Red = emergency, yellow = in progress, green = resolved</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <MapWrapper height="400px" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 xl:col-span-1 border-0 shadow-md">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-[#327da8]" />
              Recent Reports
            </CardTitle>
            <CardDescription className="text-sm">Latest activity</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <div className="space-y-2 sm:space-y-3">
              {recentReports.map((report) => (
                <Link key={report.id} href={`/reports/${report.id}`}>
                  <div className="p-2 sm:p-3 rounded-lg border bg-white hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{report.type}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" /> 
                          <span className="truncate">{report.location}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{report.time}</div>
                      </div>
                      <Badge 
                        variant={report.status === 'Active' ? 'destructive' : report.status === 'Resolved' ? 'default' : 'secondary'}
                        className={`text-xs flex-shrink-0 ml-2 ${
                          report.status === 'Active' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                          report.status === 'Resolved' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/incidents">
                <Button variant="outline" className="w-full text-[#327da8] border-[#327da8] hover:bg-[#327da8] hover:text-white">
                  View All Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
