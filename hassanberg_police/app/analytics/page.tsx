"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Calendar,
  Target,
  Activity,
  Shield,
  Timer,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { reportData } from "@/lib/report-data";
import MapWrapper from "@/components/map-wrapper";

// Enhanced data processing for analytics
const processAnalyticsData = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Process report data
  const reports = reportData.map(report => {
    const reportDate = new Date(report.datetime);
    const isEmergency = report.report_type === "Emergency Report";
    const hour = reportDate.getHours();
    const dayOfWeek = reportDate.getDay();
    const month = reportDate.getMonth();
    
    // Generate incident types
    const emergencyTypes = ["Medical Emergency", "Violence", "Breaking & Entering", "Assault"];
    const nonEmergencyTypes = ["Theft", "Vandalism", "Noise Complaint", "Suspicious Activity", "Harassment", "Drug-related", "Parking Violation"];
    const types = isEmergency ? emergencyTypes : nonEmergencyTypes;
    const incidentType = types[report.report_id % types.length];
    
    // Generate resolution time (in hours)
    const baseResolutionTime = isEmergency ? 2 : 24;
    const resolutionTime = baseResolutionTime + (report.report_id % 48);
    
    // Generate suspect info for repeat tracking
    const suspects = [
      "Unknown", "Student ID: 22001234", "Student ID: 23005678", "Student ID: 24009012",
      "External Person", "Staff Member", "Visitor", "Unknown Individual"
    ];
    const suspect = suspects[report.report_id % suspects.length];
    
    return {
      ...report,
      incidentType,
      hour,
      dayOfWeek,
      month,
      resolutionTime,
      suspect,
      campus_area: `Area ${String.fromCharCode(65 + (report.report_id % 5))}`,
      severity: isEmergency ? "High" : (report.report_id % 3 === 0 ? "Medium" : "Low")
    };
  });

  return reports;
};

// Generate time-based analytics
const generateTimeAnalytics = (reports: any[]) => {
  // Hourly distribution
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    incidents: reports.filter(r => r.hour === hour).length,
    emergency: reports.filter(r => r.hour === hour && r.report_type === "Emergency Report").length
  }));

  // Daily distribution (last 30 days)
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayReports = reports.filter(r => {
      const reportDate = new Date(r.datetime);
      return reportDate.toDateString() === date.toDateString();
    });
    
    return {
      date: date.toISOString().split('T')[0],
      incidents: dayReports.length,
      emergency: dayReports.filter(r => r.report_type === "Emergency Report").length,
      resolved: dayReports.filter(r => r.report_id % 3 === 0).length
    };
  });

  // Weekly distribution
  const weeklyData = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ].map((day, index) => ({
    day,
    incidents: reports.filter(r => r.dayOfWeek === index).length,
    emergency: reports.filter(r => r.dayOfWeek === index && r.report_type === "Emergency Report").length
  }));

  // Monthly distribution
  const monthlyData = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((month, index) => ({
    month,
    incidents: reports.filter(r => r.month === index).length,
    emergency: reports.filter(r => r.month === index && r.report_type === "Emergency Report").length
  }));

  return { hourlyData, dailyData, weeklyData, monthlyData };
};

// Generate category analytics
const generateCategoryAnalytics = (reports: any[]) => {
  const categories: Record<string, number> = {};
  reports.forEach(report => {
    categories[report.incidentType] = (categories[report.incidentType] || 0) + 1;
  });

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value);
};

// Generate campus heatmap data
const generateHeatmapData = (reports: any[]) => {
  const areas: Record<string, number> = {};
  reports.forEach(report => {
    areas[report.campus_area] = (areas[report.campus_area] || 0) + 1;
  });

  return Object.entries(areas).map(([area, incidents]) => ({
    area,
    incidents: incidents as number,
    density: (incidents as number) > 15 ? "High" : (incidents as number) > 8 ? "Medium" : "Low"
  }));
};

// Generate repeat offender data
const generateRepeatOffenderData = (reports: any[]) => {
  const suspects: Record<string, number> = {};
  reports.forEach(report => {
    if (report.suspect !== "Unknown" && report.suspect !== "Unknown Individual") {
      suspects[report.suspect] = (suspects[report.suspect] || 0) + 1;
    }
  });

  return Object.entries(suspects)
    .map(([suspect, incidents]) => ({ suspect, incidents: incidents as number }))
    .filter(item => item.incidents > 1)
    .sort((a, b) => b.incidents - a.incidents);
};

// Generate resolution time analytics
const generateResolutionAnalytics = (reports: any[]) => {
  const emergencyReports = reports.filter(r => r.report_type === "Emergency Report");
  const nonEmergencyReports = reports.filter(r => r.report_type === "Non-Emergency Report");

  const avgEmergencyTime = emergencyReports.reduce((sum, r) => sum + r.resolutionTime, 0) / emergencyReports.length;
  const avgNonEmergencyTime = nonEmergencyReports.reduce((sum, r) => sum + r.resolutionTime, 0) / nonEmergencyReports.length;

  const resolutionTrends = [
    { type: "Emergency", avgTime: Math.round(avgEmergencyTime * 10) / 10, target: 4, count: emergencyReports.length },
    { type: "Non-Emergency", avgTime: Math.round(avgNonEmergencyTime * 10) / 10, target: 24, count: nonEmergencyReports.length }
  ];

  return resolutionTrends;
};

const COLORS = ['#327da8', '#bad1de', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316', '#06b6d4'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [metricType, setMetricType] = useState("incidents");

  const reports = useMemo(() => processAnalyticsData(), []);
  const timeAnalytics = useMemo(() => generateTimeAnalytics(reports), [reports]);
  const categoryData = useMemo(() => generateCategoryAnalytics(reports), [reports]);
  const heatmapData = useMemo(() => generateHeatmapData(reports), [reports]);
  const repeatOffenders = useMemo(() => generateRepeatOffenderData(reports), [reports]);
  const resolutionData = useMemo(() => generateResolutionAnalytics(reports), [reports]);

  const getMetricValue = (data: any) => {
    switch (metricType) {
      case "emergency": return data.emergency || 0;
      case "resolved": return data.resolved || 0;
      default: return data.incidents || 0;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#327da8] to-[#bad1de] text-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Analytics & Insights</h1>
              <p className="text-white/90 text-sm sm:text-base">Crime patterns, trends, and performance metrics</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32 bg-white/20 border-white/30 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={metricType} onValueChange={setMetricType}>
              <SelectTrigger className="w-full sm:w-36 bg-white/20 border-white/30 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incidents">All Incidents</SelectItem>
                <SelectItem value="emergency">Emergency Only</SelectItem>
                <SelectItem value="resolved">Resolved Cases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-blue-600">
              <AlertTriangle className="h-4 w-4" />
              Total Incidents
            </CardDescription>
            <CardTitle className="text-3xl text-blue-700">{reports.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-red-600">
              <Shield className="h-4 w-4" />
              Emergency Cases
            </CardDescription>
            <CardTitle className="text-3xl text-red-700">
              {reports.filter(r => r.report_type === "Emergency Report").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              <Timer className="h-3 w-3 inline mr-1" />
              Avg: {resolutionData[0]?.avgTime}h resolution
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-green-600">
              <Target className="h-4 w-4" />
              Resolution Rate
            </CardDescription>
            <CardTitle className="text-3xl text-green-700">
              {Math.round((reports.filter(r => r.report_id % 3 === 0).length / reports.length) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">
              <Activity className="h-3 w-3 inline mr-1" />
              Above target (85%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-purple-600">
              <Users className="h-4 w-4" />
              Repeat Incidents
            </CardDescription>
            <CardTitle className="text-3xl text-purple-700">{repeatOffenders.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-600">
              <MapPin className="h-3 w-3 inline mr-1" />
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Crime Heatmap & Time Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Campus Heatmap */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#327da8]" />
              Campus Crime Heatmap
            </CardTitle>
            <CardDescription>Incident density across campus areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64">
                <MapWrapper height="256px" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {heatmapData.map((area, index) => (
                  <div key={area.area} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        area.density === 'High' ? 'bg-red-500' :
                        area.density === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{area.area}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{area.incidents}</div>
                      <div className="text-xs text-gray-500">{area.density} risk</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Trends */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#327da8]" />
              Peak Hours Analysis
            </CardTitle>
            <CardDescription>Incidents by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeAnalytics.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#327da8" 
                  fill="#327da8" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="emergency" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weekly Pattern */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#327da8]" />
              Weekly Patterns
            </CardTitle>
            <CardDescription>Incidents by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeAnalytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="incidents" fill="#327da8" />
                <Bar dataKey="emergency" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Trend (30 days) */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#327da8]" />
              30-Day Trend
            </CardTitle>
            <CardDescription>Daily incident reports over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeAnalytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="incidents" stroke="#327da8" strokeWidth={2} />
                <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis & Resolution Times */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-[#327da8]" />
              Top Incident Categories
            </CardTitle>
            <CardDescription>Most common types of incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time Comparison */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-[#327da8]" />
              Resolution Time Analysis
            </CardTitle>
            <CardDescription>Average time to resolve cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolutionData.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.type}</span>
                    <div className="text-right">
                      <div className="font-semibold">{item.avgTime}h avg</div>
                      <div className="text-xs text-gray-500">Target: {item.target}h</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.avgTime <= item.target ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((item.avgTime / item.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.count} cases</span>
                    <span>
                      {item.avgTime <= item.target ? 'On target' : 'Needs improvement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repeat Offenders */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#327da8]" />
            Repeat Offender Tracking
          </CardTitle>
          <CardDescription>Individuals with multiple incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          {repeatOffenders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repeatOffenders.map((offender, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{offender.suspect}</span>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      {offender.incidents} incidents
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    Requires monitoring and intervention
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 w-full text-xs border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white"
                  >
                    View History
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No repeat offenders identified in current timeframe</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
