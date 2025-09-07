"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Shield, 
  AlertTriangle, 
  FileText,
  Camera,
  Video,
  Mic,
  Paperclip,
  Edit,
  CheckCircle,
  TrendingUp,
  Navigation,
  Eye,
  EyeOff,
  Calendar,
  UserCheck
} from "lucide-react";
import { reportData, ReportItem } from "@/lib/report-data";
import MapWrapper from "@/components/map-wrapper";

// Mock data for enhanced report details
const reportTypeMap: Record<string, string[]> = {
  "Emergency Report": ["Medical Emergency", "Violence", "Breaking & Entering", "Assault"],
  "Non-Emergency Report": ["Theft", "Vandalism", "Noise Complaint", "Suspicious Activity", "Harassment", "Drug-related", "Parking Violation"]
};

const studentNames = [
  "Ahmad Rahman", "Siti Nurhaliza", "Chen Wei Ming", "Priya Sharma", "John Smith",
  "Maria Gonzalez", "Mohammed Ali", "Lisa Wong", "Kumar Patel", "Sarah Johnson",
  "David Lee", "Fatimah Hassan", "Raj Krishnan", "Amy Tan", "Marcus Brown"
];

const officers = [
  "Officer Sarah Chen", "Officer Ahmad Malik", "Officer Priya Kumar", "Officer John Davis",
  "Officer Maria Santos", "Officer David Wong", "Officer Lisa Ahmed", "Officer Kevin Tan"
];

const landmarks = [
  "Near University Library", "Behind Kolej Kediaman", "Main Campus Gate", "Student Center",
  "Engineering Faculty", "Medical Faculty", "Sports Complex", "Cafeteria Block"
];

// Enhanced transformation function
function getReportDetails(id: string): any {
  const reportId = parseInt(id);
  const report = reportData.find(r => r.report_id === reportId);
  
  if (!report) return null;

  const isEmergency = report.report_type === "Emergency Report";
  const typeOptions = reportTypeMap[report.report_type];
  const specificType = typeOptions[report.report_id % typeOptions.length];
  
  // Derive status
  let status: "Active" | "In-Progress" | "Resolved";
  if (isEmergency) {
    status = report.report_id % 3 === 0 ? "Active" : "In-Progress";
  } else {
    const statusRoll = report.report_id % 4;
    status = statusRoll === 0 ? "Active" : statusRoll === 1 ? "In-Progress" : "Resolved";
  }
  
  const severity = isEmergency ? "High" : (report.report_id % 3 === 0 ? "Medium" : "Low");
  const isAnonymous = report.report_id % 5 === 0;
  const assignedOfficer = officers[report.report_id % officers.length];
  const landmark = landmarks[report.report_id % landmarks.length];
  
  // Mock evidence
  const evidenceTypes = ['photo', 'video', 'audio', 'document'];
  const hasEvidence = report.report_id % 3 !== 0;
  const evidenceCount = hasEvidence ? (report.report_id % 4) + 1 : 0;
  
  return {
    ...report,
    id: report.report_id,
    type: specificType,
    status,
    severity,
    location: `Block ${String.fromCharCode(65 + (report.report_id % 5))}, Level ${(report.report_id % 3) + 1}`,
    landmark,
    reportedBy: isAnonymous ? "Anonymous Reporter" : studentNames[report.report_id % studentNames.length],
    reporterPhone: isAnonymous ? "Hidden" : `+60${String(report.report_id * 123456789).slice(0, 10)}`,
    isAnonymous,
    dateReported: report.datetime,
    assignedOfficer,
    description: `${specificType} incident reported at University of Malaya campus area. ${isAnonymous ? 'Reporter requested anonymity.' : `Student ID: ${report.student_id}`}`,
    detailedDescription: `Detailed report: ${specificType} occurred at the specified location. Initial assessment indicates ${severity.toLowerCase()} priority incident. ${status === 'Resolved' ? 'Case has been resolved successfully.' : status === 'In-Progress' ? 'Investigation is currently ongoing.' : 'Immediate attention required.'}`,
    evidenceCount,
    lastUpdate: new Date(Date.now() - (report.report_id * 1000000) % 86400000).toISOString(),
    caseNotes: [
      {
        timestamp: report.datetime,
        officer: "System",
        note: "Report received and logged into system"
      },
      ...(status !== "Active" ? [{
        timestamp: new Date(Date.now() - (report.report_id * 500000) % 43200000).toISOString(),
        officer: assignedOfficer,
        note: "Assigned to case and initial investigation started"
      }] : []),
      ...(status === "Resolved" ? [{
        timestamp: new Date(Date.now() - (report.report_id * 250000) % 21600000).toISOString(),
        officer: assignedOfficer,
        note: "Case resolved. All necessary actions completed."
      }] : [])
    ]
  };
}

// Get related reports
function getRelatedReports(currentReport: any) {
  return reportData
    .filter(r => r.report_id !== currentReport.report_id)
    .filter(r => {
      // Same type or nearby location
      const sameType = r.report_type === currentReport.report_type;
      const nearbyLocation = Math.abs(r.latitude - currentReport.latitude) < 0.01 && 
                             Math.abs(r.longitude - currentReport.longitude) < 0.01;
      return sameType || nearbyLocation;
    })
    .slice(0, 3)
    .map(r => {
      const typeOptions = reportTypeMap[r.report_type];
      const specificType = typeOptions[r.report_id % typeOptions.length];
      return {
        id: r.report_id,
        type: specificType,
        date: r.datetime,
        location: `Block ${String.fromCharCode(65 + (r.report_id % 5))}`
      };
    });
}

export default function ReportDetailsPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [newNote, setNewNote] = useState("");
  const [showReporterInfo, setShowReporterInfo] = useState(false);

  const reportDetails = useMemo(() => {
    return getReportDetails(reportId);
  }, [reportId]);

  const relatedReports = useMemo(() => {
    return reportDetails ? getRelatedReports(reportDetails) : [];
  }, [reportDetails]);

  if (!reportDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h2>
          <p className="text-gray-600 mb-6">The requested report could not be found.</p>
          <Link href="/incidents">
            <Button className="bg-[#327da8] hover:bg-[#2a6a91]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800 border-red-200";
      case "In-Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const addNote = () => {
    if (newNote.trim()) {
      // In a real app, this would update the database
      setNewNote("");
      // Show success message
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#327da8] to-[#bad1de] text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/incidents">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Report #{reportDetails.id}</h1>
              <p className="text-white/90">{reportDetails.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getSeverityColor(reportDetails.severity)}>
              {reportDetails.severity} Priority
            </Badge>
            <Badge className={getStatusColor(reportDetails.status)}>
              {reportDetails.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Reporter Profile */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#327da8]" />
                Reporter Information
                {reportDetails.isAnonymous && (
                  <Badge variant="outline" className="ml-2">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Anonymous
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900">{reportDetails.reportedBy}</p>
                    {!reportDetails.isAnonymous && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900">{reportDetails.reporterPhone}</p>
                    {!reportDetails.isAnonymous && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-6 px-2 text-xs border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white"
                        onClick={() => setShowReporterInfo(!showReporterInfo)}
                      >
                        {showReporterInfo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#327da8]" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-gray-900 mt-1">{reportDetails.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{reportDetails.detailedDescription}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Time Reported</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{new Date(reportDetails.dateReported).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{new Date(reportDetails.lastUpdate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Map */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#327da8]" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Exact Location</label>
                  <p className="text-gray-900 mt-1">{reportDetails.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nearest Landmark</label>
                  <p className="text-gray-900 mt-1">{reportDetails.landmark}</p>
                </div>
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapWrapper height="256px" />
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-[#327da8]" />
                Evidence ({reportDetails.evidenceCount} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportDetails.evidenceCount > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: reportDetails.evidenceCount }, (_, i) => {
                    const types = [
                      { icon: Camera, label: "Photo", color: "blue" },
                      { icon: Video, label: "Video", color: "green" },
                      { icon: Mic, label: "Audio", color: "purple" },
                      { icon: FileText, label: "Document", color: "orange" }
                    ];
                    const type = types[i % types.length];
                    const Icon = type.icon;
                    
                    return (
                      <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Icon className={`h-8 w-8 text-${type.color}-500`} />
                          <span className="text-sm font-medium">{type.label} {i + 1}</span>
                          <span className="text-xs text-gray-500">2.4 MB</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No evidence files attached</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Assignment */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#327da8]" />
                Case Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Assigned Officer</label>
                <p className="text-gray-900 mt-1">{reportDetails.assignedOfficer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Team</label>
                <p className="text-gray-900 mt-1">Campus Security Alpha</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Priority Level</label>
                <Badge className={getSeverityColor(reportDetails.severity)} variant="outline">
                  {reportDetails.severity}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-[#327da8]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!reportDetails.isAnonymous && (
                <Button className="w-full bg-[#327da8] hover:bg-[#2a6a91]">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Reporter
                </Button>
              )}
              <Button variant="outline" className="w-full border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Dispatch Patrol
              </Button>
              <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Escalate Case
              </Button>
              {reportDetails.status !== "Resolved" && (
                <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Related Reports */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#327da8]" />
                Related Reports
              </CardTitle>
              <CardDescription>
                Similar incidents nearby or same type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatedReports.length > 0 ? (
                <div className="space-y-3">
                  {relatedReports.map((report) => (
                    <Link key={report.id} href={`/reports/${report.id}`}>
                      <div className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{report.type}</h4>
                            <p className="text-xs text-gray-600">{report.location}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No related reports found</p>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-[#327da8]" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {reportDetails.caseNotes.map((note: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">{note.officer}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <Textarea
                  placeholder="Add internal note..."
                  value={newNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                  className="mb-3"
                />
                <Button 
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="w-full bg-[#327da8] hover:bg-[#2a6a91]"
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
