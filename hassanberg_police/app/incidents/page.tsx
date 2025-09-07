"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Clock, MapPin, User, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { reportData, ReportItem } from "@/lib/report-data";

// Mock report types and descriptions for better display
const reportTypeMap: Record<string, string[]> = {
  "Emergency Report": ["Medical Emergency", "Violence", "Breaking & Entering", "Assault"],
  "Non-Emergency Report": ["Theft", "Vandalism", "Noise Complaint", "Suspicious Activity", "Harassment", "Drug-related", "Parking Violation"]
};

const studentNames = [
  "Ahmad Rahman", "Siti Nurhaliza", "Chen Wei Ming", "Priya Sharma", "John Smith",
  "Maria Gonzalez", "Mohammed Ali", "Lisa Wong", "Kumar Patel", "Sarah Johnson",
  "David Lee", "Fatimah Hassan", "Raj Krishnan", "Amy Tan", "Marcus Brown"
];

// Transform raw data into display format
function transformReportData(item: ReportItem, index: number) {
  const isEmergency = item.report_type === "Emergency Report";
  const typeOptions = reportTypeMap[item.report_type];
  const specificType = typeOptions[item.report_id % typeOptions.length];
  
  // Derive status based on report type and ID
  let status: "Active" | "In-Progress" | "Resolved";
  if (isEmergency) {
    status = item.report_id % 3 === 0 ? "Active" : "In-Progress";
  } else {
    const statusRoll = item.report_id % 4;
    status = statusRoll === 0 ? "Active" : statusRoll === 1 ? "In-Progress" : "Resolved";
  }
  
  // Assign severity
  const severity = isEmergency ? "High" : (item.report_id % 3 === 0 ? "Medium" : "Low");
  
  return {
    id: item.report_id,
    type: specificType,
    status,
    severity,
    location: `Block ${String.fromCharCode(65 + (item.report_id % 5))}, Level ${(item.report_id % 3) + 1}`,
    reportedBy: studentNames[item.report_id % studentNames.length],
    dateReported: item.datetime,
    description: `${specificType} incident reported at University of Malaya campus area. Student ID: ${item.student_id}`
  };
}

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Transform and process reports
  const transformedReports = useMemo(() => {
    return reportData.map((item, index) => transformReportData(item, index));
  }, []);

  // Filter and sort logic
  const filteredReports = useMemo(() => {
    return transformedReports.filter(report => {
      const matchesSearch = 
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || report.status === statusFilter;
      const matchesType = typeFilter === "All" || report.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [transformedReports, searchTerm, statusFilter, typeFilter]);

  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
        case "oldest":
          return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
        case "severity":
          const severityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          return (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
                 (severityOrder[a.severity as keyof typeof severityOrder] || 0);
        default:
          return 0;
      }
    });
  }, [filteredReports, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = sortedReports.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "In-Progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#327da8] to-[#bad1de] text-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Incident Reports</h1>
            <p className="text-white/90 text-sm sm:text-base">Manage and track all incident reports</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[#327da8]" />
            Filters & Search
          </CardTitle>
          <CardDescription className="text-sm">
            Filter by status, type, or search through {filteredReports.length} of {transformedReports.length} reports
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Theft">Theft</SelectItem>
                <SelectItem value="Vandalism">Vandalism</SelectItem>
                <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
                <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                <SelectItem value="Harassment">Harassment</SelectItem>
                <SelectItem value="Drug-related">Drug-related</SelectItem>
                <SelectItem value="Violence">Violence</SelectItem>
                <SelectItem value="Breaking & Entering">Breaking & Entering</SelectItem>
                <SelectItem value="Parking Violation">Parking Violation</SelectItem>
                <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="severity">By Severity</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setTypeFilter("All");
                setSortBy("newest");
                setCurrentPage(1);
              }}
              className="border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {paginatedReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          report.severity === 'High' ? 'bg-red-500' :
                          report.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.type}</h3>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Reported by: {report.reportedBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(report.dateReported).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mt-2">{report.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link href={`/reports/${report.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedReports.length)} of {sortedReports.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page 
                        ? "bg-[#327da8] text-white hover:bg-[#327da8]" 
                        : "border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center">
        <Link href="/" className="text-[#327da8] hover:underline flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
